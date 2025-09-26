#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { spawn } from 'child_process';

// Load configuration
const configPath = path.join(process.cwd(), 'screenshot.config.json');
let userConfig = {};

try {
  const configFile = await fs.readFile(configPath, 'utf-8');
  userConfig = JSON.parse(configFile);
} catch (_e) {
  console.log('No screenshot.config.json found, using defaults');
}

// Configuration with defaults
const CONFIG = {
  server: {
    port: 4173,
    startTimeout: 30000,
    ...userConfig.server
  },
  screenshots: {
    outputDir: 'static/screenshots',
    viewport: { width: 1200, height: 800 },
    format: 'png',
    quality: 80,
    fullPage: false,
    waitForSelector: 'canvas, svg',
    waitTime: 2000,
    timeout: 10000,
    ...userConfig.screenshots
  },
  browser: {
    headless: true,
    reducedMotion: true,
    args: [
      '--disable-web-security',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection'
    ],
    ...userConfig.browser
  },
  parallel: {
    enabled: true,
    maxConcurrent: 3,
    ...userConfig.parallel
  }
};

/**
 * Get all applet routes from the file system
 */
async function getAppletRoutes() {
  console.log('Discovering applet routes...');

  const files = await glob('src/routes/applet/**/+page.svelte', {
    cwd: process.cwd()
  });

  const routes = files
    .map((file) => {
      // Convert file path to route
      // src/routes/applet/vectors/rules/+page.svelte -> /applet/vectors/rules
      return file.replace('src/routes', '').replace('/+page.svelte', '').replace(/\\/g, '/'); // Normalize path separators
    })
    .sort();

  console.log(`Found ${routes.length} applet routes`);
  return routes;
}

/**
 * Start the preview server
 */
function startServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting preview server...');

    const server = spawn('pnpm', ['preview', '--port', CONFIG.server.port.toString()], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let serverReady = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes(`localhost:${CONFIG.server.port}`)) {
        console.log(`Server running at http://localhost:${CONFIG.server.port}`);
        serverReady = true;
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    server.on('error', reject);

    // Timeout fallback
    setTimeout(() => {
      if (!serverReady) {
        server.kill();
        reject(new Error('Server start timeout'));
      }
    }, CONFIG.server.startTimeout);
  });
}

/**
 * Take screenshot of a specific route
 */
async function screenshotRoute(page, route) {
  try {
    const url = `http://localhost:${CONFIG.server.port}${route}`;
    console.log(`Capturing: ${route}`);

    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle', timeout: CONFIG.screenshots.timeout });

    // Wait for main visual elements
    try {
      await page.waitForSelector(CONFIG.screenshots.waitForSelector, { timeout: 5000 });
    } catch (_e) {
      console.log(`   No canvas/svg found for ${route}, proceeding anyway`);
    }

    // Additional wait for animations/dynamic content
    await page.waitForTimeout(CONFIG.screenshots.waitTime);

    // Prepare screenshot path
    const screenshotName = route.replace('/applet/', '').replace(/\//g, '_') + '.png';
    const screenshotPath = path.join(CONFIG.screenshots.outputDir, screenshotName);

    // Take screenshot
    await page.screenshot({
      path: screenshotPath,
      type: CONFIG.screenshots.format,
      fullPage: CONFIG.screenshots.fullPage
    });

    console.log(`   Saved: ${screenshotName}`);
    return { route, success: true, path: screenshotPath, filename: screenshotName };
  } catch (error) {
    console.error(`   Failed to capture ${route}:`, error.message);
    return { route, success: false, error: error.message };
  }
}

/**
 * Process routes in parallel batches
 */
async function processRoutesInBatches(browser, routes) {
  const results = [];
  const batchSize = CONFIG.parallel.enabled ? CONFIG.parallel.maxConcurrent : 1;

  console.log(`Processing ${routes.length} routes in batches of ${batchSize}...`);

  for (let i = 0; i < routes.length; i += batchSize) {
    const batch = routes.slice(i, i + batchSize);
    console.log(
      `\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(routes.length / batchSize)}`
    );

    // Create pages for parallel processing
    const batchPromises = batch.map(async (route) => {
      const context = await browser.newContext({
        viewport: CONFIG.screenshots.viewport,
        reducedMotion: CONFIG.browser.reducedMotion ? 'reduce' : 'no-preference'
      });

      const page = await context.newPage();
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

    // Progress update
    const successful = results.filter((r) => r.success).length;
    console.log(`   Progress: ${results.length}/${routes.length} (${successful} successful)`);
  }

  return results;
}

/**
 * Generate all screenshots
 */
async function generateScreenshots() {
  let server = null;
  let browser = null;

  try {
    // Ensure screenshot directory exists
    await fs.mkdir(CONFIG.screenshots.outputDir, { recursive: true });
    console.log(`Screenshot directory: ${CONFIG.screenshots.outputDir}`);

    // Get all applet routes
    const routes = await getAppletRoutes();

    if (routes.length === 0) {
      console.log('No applet routes found');
      return;
    }

    // Start server
    server = await startServer();

    // Launch browser
    console.log('Launching browser...');
    browser = await chromium.launch({
      headless: CONFIG.browser.headless,
      args: CONFIG.browser.args
    });

    // Process all routes (with parallel processing if enabled)
    const results = await processRoutesInBatches(browser, routes);
    const successful = results.filter((r) => r.success).length;

    // Summary
    console.log('\nScreenshot generation completed!');
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${results.length - successful}`);

    if (successful < results.length) {
      console.log('\nFailed routes:');
      results.filter((r) => !r.success).forEach((r) => console.log(`   - ${r.route}: ${r.error}`));
    }

    // Generate manifest
    const manifest = {
      generated: new Date().toISOString(),
      config: CONFIG,
      total: routes.length,
      successful,
      failed: results.length - successful,
      screenshots: results
        .filter((r) => r.success)
        .map((r) => ({
          route: r.route,
          path: path.relative(process.cwd(), r.path),
          filename: r.filename,
          url: `/screenshots/${r.filename}`
        }))
    };

    await fs.writeFile(
      path.join(CONFIG.screenshots.outputDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    console.log('Generated manifest.json');

    return { successful, total: results.length, results };
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
      console.log('Browser closed');
    }

    if (server) {
      server.kill();
      console.log('Server stopped');
    }
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, cleaning up...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, cleaning up...');
  process.exit(0);
});

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateScreenshots().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { generateScreenshots, getAppletRoutes };
