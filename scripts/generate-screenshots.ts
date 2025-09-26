#!/usr/bin/env node

import { chromium, Browser, BrowserContext, Page } from 'playwright';
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
 * Start the preview server
 */
function startServer(): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    console.log('Starting preview server...');

    const server = spawn('pnpm', ['preview', '--port', CONFIG.server.port.toString()], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false
    });

    let serverReady = false;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      server.removeAllListeners();
    };

    server.stdout?.on('data', (data: Buffer) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes(`localhost:${CONFIG.server.port}`)) {
        console.log(`Server running at http://localhost:${CONFIG.server.port}`);
        serverReady = true;
        cleanup();
        resolve(server);
      }
    });

    server.stderr?.on('data', (data: Buffer) => {
      const errorOutput = data.toString();
      cleanup();
      console.error('Server error:', errorOutput);
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
 * Take screenshot of a specific route
 * @param page Playwright page object
 * @param route route to the applet, e.g. /applet/complex_basics/complex_addition
 * @returns status of the page capture
 */
async function screenshotRoute(page: Page, route: string): Promise<ScreenshotResult> {
  try {
    const url = `http://localhost:${CONFIG.server.port}${route}`;
    console.log(`Capturing: ${route}`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: CONFIG.screenshots.timeout });

    // Wait for main visual elements
    try {
      await page.waitForSelector(CONFIG.screenshots.waitForSelector, { timeout: 5000 });
    } catch (_e) {
      console.log(`   No canvas/svg found for ${route}, proceeding anyway`);
    }

    await page.waitForTimeout(CONFIG.screenshots.waitTime);

    const screenshotName = getScreenshotName(route);
    const screenshotPath = path.join(CONFIG.screenshots.outputDir, screenshotName);

    await page.screenshot({
      path: screenshotPath,
      type: CONFIG.screenshots.format,
      fullPage: CONFIG.screenshots.fullPage
    });

    console.log(`   Saved: ${screenshotName}`);
    return { route, success: true, path: screenshotPath, filename: screenshotName };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`   Failed to capture ${route}:`, errorMessage);
    return { route, success: false, error: errorMessage };
  }
}

/**
 * Process routes in parallel batches
 * @param browser Playwright browser object
 * @param routes list of applet routes to process
 * @returns results of the processes
 */
async function processRoutesInBatches(
  browser: Browser,
  routes: string[]
): Promise<ScreenshotResult[]> {
  const results: ScreenshotResult[] = [];
  const batchSize = CONFIG.parallel.enabled ? CONFIG.parallel.maxConcurrent : 1;

  console.log(`Processing ${routes.length} routes in batches of ${batchSize}...`);

  for (let i = 0; i < routes.length; i += batchSize) {
    const batch = routes.slice(i, i + batchSize);
    console.log(
      `\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(routes.length / batchSize)}`
    );

    // Create pages for parallel processing
    const batchPromises = batch.map(async (route: string): Promise<ScreenshotResult> => {
      const context: BrowserContext = await browser.newContext({
        viewport: CONFIG.screenshots.viewport,
        reducedMotion: CONFIG.browser.reducedMotion ? 'reduce' : 'no-preference'
      });

      const page: Page = await context.newPage();
      page.setDefaultTimeout(CONFIG.screenshots.timeout);

      try {
        const result = await screenshotRoute(page, route);
        return result;
      } finally {
        await context.close();
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    const successful = results.filter((r) => r.success).length;
    console.log(`   Progress: ${results.length}/${routes.length} (${successful} successful)`);
  }

  return results;
}

/**
 * Cleanup function to properly close resources
 */
async function cleanup(browser: Browser | null, server: ChildProcess | null): Promise<void> {
  if (browser) {
    try {
      await browser.close();
      console.log('Browser closed');
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  }

  if (server) {
    try {
      server.kill('SIGTERM');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!server.killed) {
        server.kill('SIGKILL');
      }
      console.log('Server stopped');
    } catch (error) {
      console.error('Error stopping server:', error);
    }
  }
}

/**
 * Generate all screenshots
 */
async function generateScreenshots(): Promise<GenerationResult | undefined> {
  let server: ChildProcess | null = null;
  let browser: Browser | null = null;

  const handleExit = async () => {
    console.log('\nCleaning up resources...');
    await cleanup(browser, server);
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

    console.log('Launching browser...');
    browser = await chromium.launch({
      headless: CONFIG.browser.headless,
      args: CONFIG.browser.args
    });

    const results = await processRoutesInBatches(browser, routes);
    const successful = results.filter((r) => r.success).length;

    console.log('\nScreenshot generation completed!');
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${results.length - successful}`);

    if (successful < results.length) {
      console.log('\nFailed routes:');
      results.filter((r) => !r.success).forEach((r) => console.log(`   - ${r.route}: ${r.error}`));
    }

    return { successful, total: results.length, results };
  } catch (error) {
    console.error('Fatal error:', error);
    await cleanup(browser, server);
    process.exit(1);
  } finally {
    await cleanup(browser, server);
    setTimeout(() => {
      console.log('Force exiting...');
      process.exit(0);
    }, 2000);
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
