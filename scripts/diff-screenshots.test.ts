import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import {
  classifyDiff,
  buildSummaryMarkdown,
  runDiff,
  type DiffReport,
  type ScreenshotManifestEntry
} from './diff-screenshots';
import fs from 'fs/promises';
import path from 'path';
import { PNG } from 'pngjs';
import os from 'os';

type ManifestEntry = ScreenshotManifestEntry;

describe('classifyDiff', () => {
  it('classifies as unchanged when below threshold', () => {
    // 500 of 1,000,000 pixels = 0.05%, threshold 0.1%
    expect(classifyDiff(500, 1_000_000, 0.1)).toBe('unchanged');
  });

  it('classifies as changed when above threshold', () => {
    // 2000 of 1,000,000 pixels = 0.2%, threshold 0.1%
    expect(classifyDiff(2000, 1_000_000, 0.1)).toBe('changed');
  });

  it('classifies as unchanged exactly at threshold (strictly greater-than semantics)', () => {
    // 1000 of 1,000,000 pixels = 0.1%, threshold 0.1%. Spec says "> threshold".
    expect(classifyDiff(1000, 1_000_000, 0.1)).toBe('unchanged');
  });
});

describe('buildSummaryMarkdown', () => {
  it('reports zero changes clearly', () => {
    const report: DiffReport = {
      changed: [],
      unchanged: ['/applet/a/b'],
      skipped3D: ['/applet/c/d'],
      onlyInBefore: [],
      onlyInAfter: [],
      threshold: 0.1,
      baselineMissing: false,
      errors: []
    };
    const md = buildSummaryMarkdown(report);
    expect(md).toContain('0 applets changed');
    expect(md).toContain('1 skipped (3D/WebGL)');
  });

  it('lists changed applets with percent changed', () => {
    const report: DiffReport = {
      changed: [{ route: '/applet/foo/bar', percentChanged: 1.2345 }],
      unchanged: [],
      skipped3D: [],
      onlyInBefore: [],
      onlyInAfter: [],
      threshold: 0.1,
      baselineMissing: false,
      errors: []
    };
    const md = buildSummaryMarkdown(report);
    expect(md).toContain('1 applet changed');
    expect(md).toContain('/applet/foo/bar');
    expect(md).toContain('1.23%');
  });

  it('omits changed/skipped counts and the route dump when baseline is missing', () => {
    const report: DiffReport = {
      changed: [],
      unchanged: [],
      skipped3D: ['/applet/c/d'],
      onlyInBefore: [],
      onlyInAfter: Array.from({ length: 259 }, (_, i) => `/applet/generated/${i}`),
      threshold: 0.1,
      baselineMissing: true,
      errors: []
    };
    const md = buildSummaryMarkdown(report);
    expect(md).toContain('No baseline screenshots found');
    expect(md).not.toContain('applets changed');
    expect(md).not.toContain('skipped (3D/WebGL)');
    expect(md).not.toContain('New applets (no baseline to compare)');
    expect(md).not.toContain('/applet/generated/0');
  });

  it('mentions the error count when routes could not be compared', () => {
    const report: DiffReport = {
      changed: [],
      unchanged: [],
      skipped3D: [],
      onlyInBefore: [],
      onlyInAfter: [],
      threshold: 0.1,
      baselineMissing: false,
      errors: [{ route: '/applet/test/broken', message: 'ENOENT' }]
    };
    const md = buildSummaryMarkdown(report);
    expect(md).toContain('1 route(s) could not be compared');
  });

  it('does not mention errors when there are none', () => {
    const report: DiffReport = {
      changed: [],
      unchanged: [],
      skipped3D: [],
      onlyInBefore: [],
      onlyInAfter: [],
      threshold: 0.1,
      baselineMissing: false,
      errors: []
    };
    const md = buildSummaryMarkdown(report);
    expect(md).not.toContain('could not be compared');
  });
});

describe('runDiff integration', () => {
  let tmpDir: string;
  let beforeDir: string;
  let afterDir: string;
  let outputDir: string;

  beforeAll(async () => {
    // Create temporary directory for fixtures
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'runDiff-test-'));
    beforeDir = path.join(tmpDir, 'before');
    afterDir = path.join(tmpDir, 'after');
    outputDir = path.join(tmpDir, 'output');

    await fs.mkdir(beforeDir, { recursive: true });
    await fs.mkdir(afterDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up output directory between tests
    if (await fs.stat(outputDir).catch(() => null)) {
      await fs.rm(outputDir, { recursive: true });
    }
  });

  async function createPng(dir: string, route: string, color: number): Promise<void> {
    const subDir = path.join(dir, route.replace('/applet/', ''));
    await fs.mkdir(subDir, { recursive: true });

    const png = new PNG({ width: 50, height: 50 });
    // Fill with solid color (RGBA)
    for (let i = 0; i < png.data.length; i += 4) {
      png.data[i] = color; // R
      png.data[i + 1] = color; // G
      png.data[i + 2] = color; // B
      png.data[i + 3] = 255; // A
    }
    await fs.writeFile(path.join(subDir, 'image.png'), PNG.sync.write(png));
  }

  async function writeManifest(dir: string, entries: ManifestEntry[]): Promise<void> {
    await fs.writeFile(path.join(dir, 'manifest.json'), JSON.stringify(entries, null, 2));
  }

  it('classifies identical images as unchanged', async () => {
    // Setup: same image in both directories
    await createPng(beforeDir, '/applet/test/identical', 100);
    await createPng(afterDir, '/applet/test/identical', 100);

    await writeManifest(beforeDir, [
      {
        route: '/applet/test/identical',
        filename: 'identical.png',
        success: true,
        has3DContent: false
      }
    ]);
    await writeManifest(afterDir, [
      {
        route: '/applet/test/identical',
        filename: 'identical.png',
        success: true,
        has3DContent: false
      }
    ]);

    const report = await runDiff({
      before: beforeDir,
      after: afterDir,
      output: outputDir,
      threshold: 0.1
    });

    expect(report.unchanged).toContain('/applet/test/identical');
    expect(report.changed).not.toContainEqual(
      expect.objectContaining({ route: '/applet/test/identical' })
    );
  });

  it('detects changed images and writes diff PNG', async () => {
    // Setup: different images in before/after
    await createPng(beforeDir, '/applet/test/changed', 100);
    await createPng(afterDir, '/applet/test/changed', 200);

    await writeManifest(beforeDir, [
      { route: '/applet/test/changed', filename: 'changed.png', success: true, has3DContent: false }
    ]);
    await writeManifest(afterDir, [
      { route: '/applet/test/changed', filename: 'changed.png', success: true, has3DContent: false }
    ]);

    const report = await runDiff({
      before: beforeDir,
      after: afterDir,
      output: outputDir,
      threshold: 0.1
    });

    // Should be in changed list with percentChanged > 0
    const changed = report.changed.find((c) => c.route === '/applet/test/changed');
    expect(changed).toBeDefined();
    expect(changed!.percentChanged).toBeGreaterThan(0);

    // Diff PNG should be written
    const diffPath = path.join(outputDir, 'diffs', '_applet_test_changed.png');
    const diffExists = await fs.stat(diffPath).catch(() => null);
    expect(diffExists).toBeTruthy();
  });

  it('skips 3D/WebGL applets', async () => {
    // Setup: 3D applet should be skipped
    await createPng(beforeDir, '/applet/test/threlte', 100);
    await createPng(afterDir, '/applet/test/threlte', 150);

    await writeManifest(beforeDir, [
      { route: '/applet/test/threlte', filename: 'threlte.png', success: true, has3DContent: true }
    ]);
    await writeManifest(afterDir, [
      { route: '/applet/test/threlte', filename: 'threlte.png', success: true, has3DContent: true }
    ]);

    const report = await runDiff({
      before: beforeDir,
      after: afterDir,
      output: outputDir,
      threshold: 0.1
    });

    expect(report.skipped3D).toContain('/applet/test/threlte');
    expect(report.changed).not.toContainEqual(
      expect.objectContaining({ route: '/applet/test/threlte' })
    );
  });

  it('skips routes with failed renders (success: false)', async () => {
    // Setup: failed render in before
    await createPng(beforeDir, '/applet/test/failed', 100);
    await createPng(afterDir, '/applet/test/failed', 100);

    await writeManifest(beforeDir, [
      {
        route: '/applet/test/failed',
        filename: 'failed.png',
        success: false,
        has3DContent: false,
        error: 'render error'
      }
    ]);
    await writeManifest(afterDir, [
      { route: '/applet/test/failed', filename: 'failed.png', success: true, has3DContent: false }
    ]);

    const report = await runDiff({
      before: beforeDir,
      after: afterDir,
      output: outputDir,
      threshold: 0.1
    });

    // Failed render should not be in any diff category
    expect(report.unchanged).not.toContain('/applet/test/failed');
    expect(report.changed).not.toContainEqual(
      expect.objectContaining({ route: '/applet/test/failed' })
    );
    expect(report.skipped3D).not.toContain('/applet/test/failed');
  });

  it('detects routes only in after manifest', async () => {
    // Setup: new applet in after
    await createPng(afterDir, '/applet/test/new', 100);

    await writeManifest(beforeDir, [
      { route: '/applet/test/old', filename: 'old.png', success: true, has3DContent: false }
    ]);
    await writeManifest(afterDir, [
      { route: '/applet/test/new', filename: 'new.png', success: true, has3DContent: false }
    ]);

    // Need to create the old image in before to avoid errors
    await createPng(beforeDir, '/applet/test/old', 100);

    const report = await runDiff({
      before: beforeDir,
      after: afterDir,
      output: outputDir,
      threshold: 0.1
    });

    expect(report.onlyInAfter).toContain('/applet/test/new');
  });

  it('detects routes only in before manifest', async () => {
    // Setup: removed applet (only in before)
    await createPng(beforeDir, '/applet/test/removed', 100);
    await createPng(afterDir, '/applet/test/kept', 100);

    await writeManifest(beforeDir, [
      { route: '/applet/test/removed', filename: 'removed.png', success: true, has3DContent: false }
    ]);
    await writeManifest(afterDir, [
      { route: '/applet/test/kept', filename: 'kept.png', success: true, has3DContent: false }
    ]);

    // Need to create the kept image in before too
    await createPng(beforeDir, '/applet/test/kept', 100);

    const report = await runDiff({
      before: beforeDir,
      after: afterDir,
      output: outputDir,
      threshold: 0.1
    });

    expect(report.onlyInBefore).toContain('/applet/test/removed');
  });

  it('handles dimension mismatches as 100% changed', async () => {
    // Setup: images with different dimensions
    const createPngWithDims = async (dir: string, route: string, width: number, height: number) => {
      const subDir = path.join(dir, route.replace('/applet/', ''));
      await fs.mkdir(subDir, { recursive: true });

      const png = new PNG({ width, height });
      for (let i = 0; i < png.data.length; i += 4) {
        png.data[i] = 100;
        png.data[i + 1] = 100;
        png.data[i + 2] = 100;
        png.data[i + 3] = 255;
      }
      await fs.writeFile(path.join(subDir, 'image.png'), PNG.sync.write(png));
    };

    await createPngWithDims(beforeDir, '/applet/test/resized', 50, 50);
    await createPngWithDims(afterDir, '/applet/test/resized', 100, 100);

    await writeManifest(beforeDir, [
      { route: '/applet/test/resized', filename: 'resized.png', success: true, has3DContent: false }
    ]);
    await writeManifest(afterDir, [
      { route: '/applet/test/resized', filename: 'resized.png', success: true, has3DContent: false }
    ]);

    const report = await runDiff({
      before: beforeDir,
      after: afterDir,
      output: outputDir,
      threshold: 0.1
    });

    const changed = report.changed.find((c) => c.route === '/applet/test/resized');
    expect(changed).toBeDefined();
    expect(changed!.percentChanged).toBe(100);
  });

  it('treats a missing baseline manifest as "no baseline" instead of crashing', async () => {
    // A --before directory with no manifest.json at all (e.g. a `main`
    // checkout from before this tooling existed) must not throw.
    const noBaselineDir = path.join(tmpDir, 'no-baseline');
    await fs.mkdir(noBaselineDir, { recursive: true });

    await createPng(afterDir, '/applet/test/no-baseline-case', 100);
    await writeManifest(afterDir, [
      {
        route: '/applet/test/no-baseline-case',
        filename: 'no-baseline-case.png',
        success: true,
        has3DContent: false
      }
    ]);

    const report = await runDiff({
      before: noBaselineDir,
      after: afterDir,
      output: outputDir,
      threshold: 0.1
    });

    expect(report.baselineMissing).toBe(true);
    expect(report.onlyInAfter).toContain('/applet/test/no-baseline-case');
    expect(report.changed).toEqual([]);

    const md = buildSummaryMarkdown(report);
    expect(md).toContain('No baseline screenshots found');
    expect(md).not.toContain('applets changed');
    expect(md).not.toContain('skipped (3D/WebGL)');
  });

  it('does not crash the whole run when a route is missing its PNG, and still compares other routes', async () => {
    // One route with a manifest entry but no PNG file (simulates a truncated
    // artifact upload/download or a stale cached baseline), plus one normal
    // unrelated route in the same batch to prove the crash doesn't take down
    // the whole run.
    await createPng(beforeDir, '/applet/test/missing-png', 100);
    // Intentionally do NOT create the after PNG for this route.
    await createPng(beforeDir, '/applet/test/unrelated-ok', 100);
    await createPng(afterDir, '/applet/test/unrelated-ok', 100);

    await writeManifest(beforeDir, [
      {
        route: '/applet/test/missing-png',
        filename: 'missing-png.png',
        success: true,
        has3DContent: false
      },
      {
        route: '/applet/test/unrelated-ok',
        filename: 'unrelated-ok.png',
        success: true,
        has3DContent: false
      }
    ]);
    await writeManifest(afterDir, [
      {
        route: '/applet/test/missing-png',
        filename: 'missing-png.png',
        success: true,
        has3DContent: false
      },
      {
        route: '/applet/test/unrelated-ok',
        filename: 'unrelated-ok.png',
        success: true,
        has3DContent: false
      }
    ]);

    const report = await runDiff({
      before: beforeDir,
      after: afterDir,
      output: outputDir,
      threshold: 0.1
    });

    expect(report.errors).toContainEqual(
      expect.objectContaining({ route: '/applet/test/missing-png' })
    );
    expect(report.unchanged).toContain('/applet/test/unrelated-ok');
  });

  it('throws when the --after directory has no manifest.json', async () => {
    const noManifestDir = path.join(tmpDir, 'no-after-manifest');
    await fs.mkdir(noManifestDir, { recursive: true });

    await expect(
      runDiff({
        before: beforeDir,
        after: noManifestDir,
        output: outputDir,
        threshold: 0.1
      })
    ).rejects.toThrow(/No manifest\.json found in --after directory/);
  });
});
