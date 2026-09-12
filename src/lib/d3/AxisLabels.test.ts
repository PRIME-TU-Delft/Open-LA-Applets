import { describe, it, expect } from 'vitest';
import { getXLabelX, getYLabelY } from './AxisLabels';
import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
import type { Transform2D } from '$lib/stores/camera.svelte';

function transform(x: number, y: number, k: number): Transform2D {
  return { x, y, k } as Transform2D;
}

describe('getXLabelX / getYLabelY', () => {
  it('returns the default fallback when there is no camera transform', () => {
    expect(getXLabelX(undefined, undefined, 500, 1, undefined)).toBeCloseTo(6.8);
    expect(getYLabelY(undefined, undefined, 500, 300, 1, undefined)).toBeCloseTo(6.25);
  });

  it('two calls with different baselines are independent (split-view regression)', () => {
    // Use a non-unity zoom so the baseline term doesn't algebraically cancel out,
    // and small enough pan/zoom that results don't clamp to ±GRID_SIZE_2D.
    const t = transform(10, 10, 2);

    const withBaselineA = getXLabelX(t, { x: 0, y: 0 }, 500, 1, undefined);
    const withBaselineB = getXLabelX(t, { x: 5, y: 5 }, 500, 1, undefined);

    expect(withBaselineA).not.toBeCloseTo(withBaselineB, 5);

    // Calling with baseline B again yields the same result as before (no shared/mutated state).
    const withBaselineBAgain = getXLabelX(t, { x: 5, y: 5 }, 500, 1, undefined);
    expect(withBaselineBAgain).toBeCloseTo(withBaselineB);

    const withBaselineAAgain = getXLabelX(t, { x: 0, y: 0 }, 500, 1, undefined);
    expect(withBaselineAAgain).toBeCloseTo(withBaselineA);
  });

  it('uses the center branch when xLabelPosition/yLabelPosition is center', () => {
    const t = transform(0, 0, 1);

    const center = getXLabelX(t, undefined, 500, 1, { xLabelPosition: 'center' });
    const edge = getXLabelX(t, undefined, 500, 1, undefined);
    expect(center).not.toBeCloseTo(edge, 5);

    const yCenter = getYLabelY(t, undefined, 500, 300, 1, { yLabelPosition: 'center' });
    const yEdge = getYLabelY(t, undefined, 500, 300, 1, undefined);
    expect(yCenter).not.toBeCloseTo(yEdge, 5);
  });

  it('clamps the result at ±GRID_SIZE_2D', () => {
    const t = transform(1e9, 1e9, 1e-6);

    const x = getXLabelX(t, undefined, 500, 1, undefined);
    const y = getYLabelY(t, undefined, 500, 300, 1, undefined);

    expect(Math.abs(x)).toBeLessThanOrEqual(GRID_SIZE_2D);
    expect(Math.abs(y)).toBeLessThanOrEqual(GRID_SIZE_2D);
  });
});
