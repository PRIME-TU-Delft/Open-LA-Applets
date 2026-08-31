#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Screenshot Diff Script
 *
 * Compares two screenshot output directories (each produced by
 * generate-screenshots.ts, i.e. containing a manifest.json + per-route
 * image.png files) and reports which 2D applets changed visually.
 */

import fs from 'fs/promises';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { fileURLToPath } from 'url';
import type { ScreenshotManifestEntry } from './generate-screenshots';

export type { ScreenshotManifestEntry };

export interface DiffReport {
  changed: { route: string; percentChanged: number }[];
  unchanged: string[];
  skipped3D: string[];
  onlyInBefore: string[];
  onlyInAfter: string[];
  threshold: number;
  baselineMissing: boolean;
  errors: { route: string; message: string }[];
}

/**
 * Decide whether a route's diff counts as a visual change.
 * Strictly greater-than the threshold, per issue #454 ("> 0.1%" default).
 */
export function classifyDiff(
  diffPixels: number,
  totalPixels: number,
  thresholdPercent: number
): 'changed' | 'unchanged' {
  const percent = (diffPixels / totalPixels) * 100;
  return percent > thresholdPercent ? 'changed' : 'unchanged';
}

/**
 * Build the Markdown PR-comment body from a diff report.
 */
export function buildSummaryMarkdown(report: DiffReport): string {
  const lines: string[] = [];

  if (report.baselineMissing) {
    lines.push(
      '**No baseline screenshots found for `main`.** The PR base commit does not have this ' +
        'action merged yet, so it has no `manifest.json` to compare against. This will keep ' +
        'happening on every run of this PR until it merges to `main`; after that, future PRs ' +
        'will get a real visual diff.'
    );
    return lines.join('\n');
  }

  lines.push(
    `**${report.changed.length} applet${report.changed.length === 1 ? '' : 's'} changed** ` +
      `visually vs \`main\` (threshold: >${report.threshold}% pixels).`
  );
  lines.push(`${report.skipped3D.length} skipped (3D/WebGL).`);
  if (report.errors.length > 0) {
    lines.push(
      `${report.errors.length} route(s) could not be compared (see report.json for details).`
    );
  }
  lines.push('');

  if (report.changed.length > 0) {
    lines.push('| Applet | % changed |');
    lines.push('| --- | --- |');
    for (const c of [...report.changed].sort((a, b) => b.percentChanged - a.percentChanged)) {
      lines.push(`| \`${c.route}\` | ${c.percentChanged.toFixed(2)}% |`);
    }
    lines.push('');
  }

  if (report.onlyInAfter.length > 0) {
    lines.push(
      `New applets (no baseline to compare): ${report.onlyInAfter.map((r) => `\`${r}\``).join(', ')}`
    );
  }
  if (report.onlyInBefore.length > 0) {
    lines.push(
      `Removed applets (no longer rendered): ${report.onlyInBefore.map((r) => `\`${r}\``).join(', ')}`
    );
  }

  return lines.join('\n');
}

/**
 * Read a screenshot directory's manifest.json. Returns `null` (rather than
 * throwing) when the manifest is absent, so a `main` checkout from before
 * this tooling existed degrades to "no baseline" instead of crashing the
 * whole diff run.
 */
async function readManifest(dir: string): Promise<ScreenshotManifestEntry[] | null> {
  let raw: string;
  try {
    raw = await fs.readFile(path.join(dir, 'manifest.json'), 'utf-8');
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
  return JSON.parse(raw) as ScreenshotManifestEntry[];
}

function routeToImagePath(dir: string, route: string): string {
  return path.join(dir, route.replace('/applet/', ''), 'image.png');
}

async function loadPng(filePath: string): Promise<PNG> {
  const buffer = await fs.readFile(filePath);
  return PNG.sync.read(buffer);
}

interface DiffArgs {
  before: string;
  after: string;
  output: string;
  threshold: number;
}

function parseArgs(argv: string[]): DiffArgs {
  const get = (flag: string, fallback?: string): string => {
    const idx = argv.indexOf(flag);
    if (idx === -1 || idx === argv.length - 1) {
      if (fallback !== undefined) return fallback;
      throw new Error(`Missing required argument: ${flag}`);
    }
    return argv[idx + 1];
  };

  return {
    before: get('--before'),
    after: get('--after'),
    output: get('--output'),
    threshold: parseFloat(get('--threshold', '0.1'))
  };
}

/**
 * Run the full diff between two screenshot directories.
 */
export async function runDiff(args: DiffArgs): Promise<DiffReport> {
  const beforeManifest = await readManifest(args.before);
  const afterManifest = await readManifest(args.after);

  if (afterManifest === null) {
    // The PR side always runs this same tooling, so a missing manifest here
    // means the screenshot-generation step itself failed — a real problem
    // to surface, unlike a missing baseline (see readManifest's doc comment).
    throw new Error(`No manifest.json found in --after directory: ${args.after}`);
  }

  const baselineMissing = beforeManifest === null;
  const beforeByRoute = new Map((beforeManifest ?? []).map((e) => [e.route, e]));
  const afterByRoute = new Map(afterManifest.map((e) => [e.route, e]));

  const report: DiffReport = {
    changed: [],
    unchanged: [],
    skipped3D: [],
    onlyInBefore: [],
    onlyInAfter: [],
    threshold: args.threshold,
    baselineMissing,
    errors: []
  };

  await fs.mkdir(path.join(args.output, 'diffs'), { recursive: true });

  for (const [route, afterEntry] of afterByRoute) {
    const beforeEntry = beforeByRoute.get(route);

    if (!beforeEntry) {
      report.onlyInAfter.push(route);
      continue;
    }

    if (afterEntry.has3DContent || beforeEntry.has3DContent) {
      report.skipped3D.push(route);
      continue;
    }

    if (!afterEntry.success || !beforeEntry.success) {
      // A render failure isn't a visual diff to report here — the
      // screenshot-generation step already fails the build loudly for this
      // (see issue #438). Skip rather than false-flag it as "changed".
      continue;
    }

    try {
      const beforePng = await loadPng(routeToImagePath(args.before, route));
      const afterPng = await loadPng(routeToImagePath(args.after, route));

      if (beforePng.width !== afterPng.width || beforePng.height !== afterPng.height) {
        report.changed.push({ route, percentChanged: 100 });
        continue;
      }

      const { width, height } = beforePng;
      const diffPng = new PNG({ width, height });
      const diffPixels = pixelmatch(beforePng.data, afterPng.data, diffPng.data, width, height, {
        threshold: 0.1 // pixelmatch's own per-pixel AA-tolerance matching threshold (0-1 scale)
      });

      const totalPixels = width * height;
      const percentChanged = (diffPixels / totalPixels) * 100;

      if (classifyDiff(diffPixels, totalPixels, args.threshold) === 'changed') {
        report.changed.push({ route, percentChanged });
        const diffPath = path.join(args.output, 'diffs', `${route.replace(/\//g, '_')}.png`);
        await fs.writeFile(diffPath, PNG.sync.write(diffPng));
      } else {
        report.unchanged.push(route);
      }
    } catch (error) {
      // A missing/corrupt PNG for a single route (truncated artifact
      // upload/download, a stale cached baseline, a manifest/PNG mismatch)
      // must not crash the whole diff run for every other route.
      const message = error instanceof Error ? error.message : String(error);
      report.errors.push({ route, message });
      continue;
    }
  }

  for (const route of beforeByRoute.keys()) {
    if (!afterByRoute.has(route)) {
      report.onlyInBefore.push(route);
    }
  }

  return report;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const report = await runDiff(args);

  await fs.mkdir(args.output, { recursive: true });
  await fs.writeFile(path.join(args.output, 'report.json'), JSON.stringify(report, null, 2));

  const markdown = buildSummaryMarkdown(report);
  await fs.writeFile(path.join(args.output, 'summary.md'), markdown);

  console.log(markdown);
  console.log(`\nFull report written to ${path.join(args.output, 'report.json')}`);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error('Fatal error in diff-screenshots:', error);
    process.exit(1);
  });
}
