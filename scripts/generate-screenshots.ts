#!/usr/bin/env node
/* eslint-disable no-console */

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

/**
 * Build a JS source string that overrides `Math.random` with a seeded
 * mulberry32 PRNG. Injected into every page before app scripts run, so the
 * 6 applets that call `Math.random` render identically across CI runs.
 */
export function buildSeededRandomInjectionScript(seed: number): string {
  return `
    (function () {
      let state = ${seed} >>> 0;
      Math.random = function () {
        state |= 0;
        state = (state + 0x6D2B79F5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })();
  `;
}

const SCREENSHOT_RANDOM_SEED = 454; // fixed seed for deterministic screenshot rendering

interface ScreenshotConfig {
  server: {
    port: number;
    startTimeout: number;
  };
  screenshots: {
    timeout: number;
    timeoutOverrides?: Record<string, number>;
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
  has3DContent: boolean;
}

interface GenerationResult {
  successful: number;
  total: number;
  results: ScreenshotResult[];
}

/**
 * Shape of each entry written to manifest.json, and the single source of
 * truth for that shape shared with diff-screenshots.ts (and its tests) — see
 * issue #454 review: previously this shape was independently redeclared in
 * three places with no compiler-enforced contract between producer/consumer.
 */
export interface ScreenshotManifestEntry {
  route: string;
  filename: string;
  success: boolean;
  has3DContent: boolean;
  error?: string;
}

const configPath = path.join(process.cwd(), 'scripts/screenshot.config.json');
let CONFIG: ScreenshotConfig = {} as ScreenshotConfig;

try {
  const configFile = await fs.readFile(configPath, 'utf-8');
  CONFIG = JSON.parse(configFile) as ScreenshotConfig;
} catch (error) {
  console.error('Failed to load screenshot.config.json:', error);
  process.exit(1);
}

const isNetlify = process.env.BUILD_ENV === 'netlify';
if (isNetlify) {
  CONFIG.screenshots.outputDir = 'build-netlify/' + CONFIG.screenshots.outputDir;
  console.log('Running on Netlify - output directory set to:', CONFIG.screenshots.outputDir);
} else {
  CONFIG.screenshots.outputDir = 'build/client/' + CONFIG.screenshots.outputDir;
  console.log('Output directory set to:', CONFIG.screenshots.outputDir);
}

/**
 * Get all applet routes
 * @returns a list of all applet routes
 */
async function getAppletRoutes(): Promise<string[]> {
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
 * Resolve the navigation timeout for a route, honoring any configured prefix override
 */
function getNavigationTimeout(route: string): number {
  const overrides = CONFIG.screenshots.timeoutOverrides ?? {};
  const match = Object.keys(overrides).find((prefix) => route.startsWith(prefix));
  return match ? overrides[match] : CONFIG.screenshots.timeout;
}

// Puppeteer treats a goto timeout of 0 as "wait forever", but the cluster's own task
// timeout can't be disabled the same way, so a disabled override falls back to this instead
const DISABLED_TIMEOUT_CLUSTER_FALLBACK = 10 * 60 * 1000; // 10 minutes

/**
 * Compute the puppeteer-cluster task timeout, large enough to cover the biggest
 * configured navigation timeout (including any disabled per-route overrides)
 */
function getClusterTaskTimeout(): number {
  const overrideValues = Object.values(CONFIG.screenshots.timeoutOverrides ?? {}).map((value) =>
    value === 0 ? DISABLED_TIMEOUT_CLUSTER_FALLBACK : value
  );
  const largestTimeout = Math.max(CONFIG.screenshots.timeout, ...overrideValues);

  return largestTimeout * 2;
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
    timeout: getClusterTaskTimeout(),
    retryLimit: 0
  });

  await cluster.task(async ({ page, data: route }) => {
    let has3DContent = false;
    try {
      await page.evaluateOnNewDocument(buildSeededRandomInjectionScript(SCREENSHOT_RANDOM_SEED));
      await page.setViewport({ ...CONFIG.screenshots.viewport, deviceScaleFactor: 1 });

      if (CONFIG.browser.reducedMotion) {
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      }

      const url = `http://localhost:${CONFIG.server.port}${route}?hideButtons=true`;
      console.log(`Capturing: ${route}`);

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: getNavigationTimeout(route)
      });
      try {
        await page.waitForSelector(CONFIG.screenshots.waitForSelector, { timeout: 5000 });

        has3DContent = await page.evaluate(() => {
          return document.querySelectorAll('canvas').length != 0;
        });
      } catch (_e) {
        console.log(`   No canvas/svg found for ${route}, proceeding anyway`);
      }

      await page.evaluate(() => {
        // wait for 1 frame
        return new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve(undefined));
          });
        });
      });

      if (has3DContent) {
        for (let i = 0; i < 10; i++) {
          // wait for 10 frames
          await page.evaluate(() => {
            return new Promise((resolve) => {
              requestAnimationFrame(() => resolve(undefined));
            });
          });
        }
      }

      await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshots.waitTime)); // to be sure

      const screenshotName = getScreenshotName(route, false);
      const screenshotPath = path.join(CONFIG.screenshots.outputDir, screenshotName);

      await fs.mkdir(screenshotPath.replace('image.png', ''), { recursive: true });

      await page.screenshot({
        path: screenshotPath as `${string}.png` | `${string}.jpeg`,
        type: CONFIG.screenshots.format,
        fullPage: CONFIG.screenshots.fullPage
      });

      console.log(`   Saved: ${screenshotName}`);
      results.push({
        route,
        success: true,
        path: screenshotPath,
        filename: screenshotName,
        has3DContent
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`   Failed to capture ${route}:`, errorMessage);
      // has3DContent may not have been determined yet if the failure happened
      // before detection ran — default to false so a failed route still shows
      // up in the manifest rather than being silently dropped.
      results.push({ route, success: false, error: errorMessage, has3DContent });
    }

    const successful = results.filter((r) => r.success).length;
    console.log(`Progress: ${results.length}/${routes.length} (${successful} successful)`);
  });

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
      server.removeAllListeners();
      server.stdout?.removeAllListeners();
      server.stderr?.removeAllListeners();

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
    await delay(2 * CONFIG.screenshots.waitTime);

    const results = await processRoutesWithCluster(routes);
    const successful = results.filter((r: ScreenshotResult) => r.success).length;

    const manifest: ScreenshotManifestEntry[] = results.map((r) => ({
      route: r.route,
      filename: r.filename ?? getScreenshotName(r.route, false),
      success: r.success,
      has3DContent: r.has3DContent,
      ...(r.error ? { error: r.error } : {})
    }));
    await fs.writeFile(
      path.join(CONFIG.screenshots.outputDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    console.log(`Wrote manifest.json with ${manifest.length} entries`);

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
    .then((result) => {
      if (result && result.successful < result.total) {
        console.error(
          `Screenshot generation failed: ${result.total - result.successful}/${result.total} routes failed`
        );
        process.exit(1);
      }
      console.log('Screenshot generation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}
