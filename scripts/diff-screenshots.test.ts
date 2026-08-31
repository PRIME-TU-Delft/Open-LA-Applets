import { describe, it, expect } from 'vitest';
import { classifyDiff, buildSummaryMarkdown, type DiffReport } from './diff-screenshots';

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
    // 1000 of 1,000,000 pixels = 0.1%, threshold 0.1% — spec says "> threshold"
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
      threshold: 0.1
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
      threshold: 0.1
    };
    const md = buildSummaryMarkdown(report);
    expect(md).toContain('1 applet changed');
    expect(md).toContain('/applet/foo/bar');
    expect(md).toContain('1.23%');
  });
});
