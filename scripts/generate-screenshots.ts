#!/usr/bin/env node

/**
 * Screenshot Generation Script
 *
 * Generates screenshots for all applet routes using puppeteer-cluster.
 *
 * Features:
 * - Parallel screenshot capture using puppeteer-cluster
 * - Works with system Chromium in Docker or bundled Chromium locally
 */

import { Cluster } from 'puppeteer-cluster';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { spawn, ChildProcess } from 'child_process';
import { fileURLToPath } from 'url';
import { getScreenshotName } from '../src/lib/screenshots/utils';

interface ScreenshotConfig {
  server: {
    port: number;
    startTimeout: number;
  };
  screenshots: {
    timeout: number;
    waitForSelector: string;
    waitTime: number;
    outputDir: string;
    format: 'png' | 'jpeg';
    fullPage: boolean;
    viewport: {
      width: number;
      height: number;
    };
  };
  browser: {
    headless: boolean;
    args: string[];
    reducedMotion: boolean;
  };
  parallel: {
    enabled: boolean;
    maxConcurrent: number;
  };
}

interface ScreenshotResult {
  route: string;
  success: boolean;
  path?: string;
  filename?: string;
  error?: string;
}

interface GenerationResult {
  successful: number;
  total: number;
  results: ScreenshotResult[];
}

const configPath = path.join(process.cwd(), 'scripts/screenshot.config.json');
let CONFIG: ScreenshotConfig = {} as ScreenshotConfig;

try {
  const configFile = await fs.readFile(configPath, 'utf-8');
  CONFIG = JSON.parse(configFile) as ScreenshotConfig;
} catch (_e) {
  console.log('No screenshot.config.json found!');
}

// Override output directory if running on Netlify
const isNetlify = process.env.BUILD_ENV === 'netlify';
if (isNetlify) {
  CONFIG.screenshots.outputDir = 'build-netlify/screenshots';
  console.log('Running on Netlify - output directory set to:', CONFIG.screenshots.outputDir);
}

/**
 * Get all applet routes
 * @returns a list of all applet routes
 */
async function getAppletRoutes(): Promise<string[]> {
  console.log('Discovering applet routes...');

  const files = await glob('src/routes/applet/**/+page.svelte', {
    cwd: process.cwd()
  });

  const routes = files
    .map((file) => {
      return file.replace('src/routes', '').replace('/+page.svelte', '').replace(/\\/g, '/');
    })
    .filter((s) => s !== '/applet/[...applet]/static')
    .sort();

  console.log(`Found ${routes.length} applet routes`);
  return routes;
}

/**
 * Strip ANSI escape codes from text (colors, bold, etc.)
 */
function stripAnsi(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '');
}

/**
 * Start the preview server
 */
function startServer(): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    console.log('Starting preview server...');

    const server = spawn('pnpm', ['preview', '--port', CONFIG.server.port.toString()], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true // Create new process group so we can kill all child processes
    });

    // if (isNetlify) {
    //   console.log('Running on Netlify - using fixed wait time for server startup');

    //   server.stdout?.on('data', (data: Buffer) => {
    //     console.log('Server:', data.toString().trim());
    //   });

    //   server.stderr?.on('data', (data: Buffer) => {
    //     console.error('Server error:', data.toString().trim());
    //   });

    //   setTimeout(() => {
    //     console.log(`Assuming server is ready at http://localhost:${CONFIG.server.port}`);
    //     resolve(server);
    //   }, 5000);

    //   return;
    // }

    let serverReady = false;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      server.removeAllListeners();
    };

    server.stdout?.on('data', (data: Buffer) => {
      const output = data.toString();
      console.log('Server:', output.trim());

      const cleanOutput = stripAnsi(output);
      if (
        cleanOutput.includes('Local:') ||
        cleanOutput.includes(`localhost:${CONFIG.server.port}`)
      ) {
        console.log(`Server running at http://localhost:${CONFIG.server.port}`);
        serverReady = true;
        cleanup();
        resolve(server);
      }
    });

    server.stderr?.on('data', (data: Buffer) => {
      const errorOutput = data.toString();
      console.error('Server error:', errorOutput.trim());
      cleanup();
    });

    server.on('error', (error) => {
      cleanup();
      reject(error);
    });

    server.on('exit', (code) => {
      if (!serverReady) {
        cleanup();
        reject(new Error(`Server exited with code ${code} before becoming ready`));
      }
    });

    // Timeout fallback
    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      if (!serverReady) {
        cleanup();
        server.kill('SIGTERM');
        reject(new Error('Server start timeout'));
      }
    }, CONFIG.server.startTimeout);
  });
}

/**
 * Process routes using puppeteer-cluster
 * @param routes list of applet routes to process
 * @returns results of the processes
 */
async function processRoutesWithCluster(routes: string[]): Promise<ScreenshotResult[]> {
  const results: ScreenshotResult[] = [];

  const concurrency = CONFIG.parallel.enabled ? CONFIG.parallel.maxConcurrent : 1;
  console.log(`Processing ${routes.length} routes with ${concurrency} concurrent worker(s)...`);

  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: concurrency,
    puppeteerOptions: {
      headless: CONFIG.browser.headless,
      args: CONFIG.browser.args,
      executablePath: executablePath
    },
    timeout: CONFIG.screenshots.timeout * 2,
    retryLimit: 0
  });

  // Define task to capture screenshots
  await cluster.task(async ({ page, data: route }) => {
    try {
      await page.setViewport(CONFIG.screenshots.viewport);

      if (CONFIG.browser.reducedMotion) {
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      }

      const url = `http://localhost:${CONFIG.server.port}${route}?hideButtons=true`;
      console.log(`Capturing: ${route}`);

      await page.goto(url, { waitUntil: 'networkidle0', timeout: CONFIG.screenshots.timeout });

      // Wait for main visual elements
      try {
        await page.waitForSelector(CONFIG.screenshots.waitForSelector, { timeout: 5000 });
      } catch (_e) {
        console.log(`   No canvas/svg found for ${route}, proceeding anyway`);
      }

      await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshots.waitTime));

      const screenshotName = getScreenshotName(route);
      const screenshotPath = path.join(CONFIG.screenshots.outputDir, screenshotName);

      await page.screenshot({
        path: screenshotPath as `${string}.png` | `${string}.jpeg`,
        type: CONFIG.screenshots.format,
        fullPage: CONFIG.screenshots.fullPage
      });

      console.log(`   Saved: ${screenshotName}`);
      results.push({ route, success: true, path: screenshotPath, filename: screenshotName });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`   Failed to capture ${route}:`, errorMessage);
      results.push({ route, success: false, error: errorMessage });
    }

    const successful = results.filter((r) => r.success).length;
    console.log(`Progress: ${results.length}/${routes.length} (${successful} successful)`);
  });

  // Queue all routes and wait for completion
  for (const route of routes) {
    cluster.queue(route);
  }

  await cluster.idle();
  await cluster.close();

  return results;
}

/**
 * Cleanup function
 */
async function cleanup(server: ChildProcess | null): Promise<void> {
  if (server && !server.killed) {
    try {
      // Remove listeners to prevent error messages
      server.removeAllListeners();
      server.stdout?.removeAllListeners();
      server.stderr?.removeAllListeners();

      // Kill the process and its children
      if (server.pid) {
        try {
          // Kill the entire process group (negative PID)
          process.kill(-server.pid, 'SIGTERM');
        } catch (_e) {
          server.kill('SIGTERM');
        }
      } else {
        server.kill('SIGTERM');
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Force kill if still running
      if (server.pid && !server.killed) {
        try {
          process.kill(-server.pid, 'SIGKILL');
        } catch (_e) {
          server.kill('SIGKILL');
        }
      }
    } catch (_e) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Generate all screenshots
 */
async function generateScreenshots(): Promise<GenerationResult | undefined> {
  let server: ChildProcess | null = null;

  const handleExit = async () => {
    console.log('\nCleaning up resources...');
    await cleanup(server);
    process.exit(0);
  };

  process.removeAllListeners('SIGINT');
  process.removeAllListeners('SIGTERM');
  process.on('SIGINT', handleExit);
  process.on('SIGTERM', handleExit);

  try {
    await fs.mkdir(CONFIG.screenshots.outputDir, { recursive: true });
    console.log(`Screenshot directory: ${CONFIG.screenshots.outputDir}`);

    const routes = await getAppletRoutes();

    if (routes.length === 0) {
      console.log('No applet routes found');
      return;
    }

    server = await startServer();

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(2 * CONFIG.screenshots.waitTime); // wait for server to fully start

    const results = await processRoutesWithCluster(routes);
    const successful = results.filter((r: ScreenshotResult) => r.success).length;

    console.log('\nScreenshot generation completed!');
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${results.length - successful}`);

    if (successful < results.length) {
      console.log('\nFailed routes:');
      results
        .filter((r: ScreenshotResult) => !r.success)
        .forEach((r: ScreenshotResult) => console.log(`   - ${r.route}: ${r.error}`));
    }

    return { successful, total: results.length, results };
  } catch (error) {
    console.error('Fatal error:', error);
    await cleanup(server);
    process.exit(1);
  } finally {
    await cleanup(server);
  }
}

// Run the script from shell
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  generateScreenshots()
    .then(() => {
      console.log('Screenshot generation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}
