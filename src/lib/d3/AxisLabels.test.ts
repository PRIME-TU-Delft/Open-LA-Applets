import { describe, it, expect } from 'vitest';
import { getXLabelX, getYLabelY, type AxisLabelLayout } from './AxisLabels';
import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
import type { Transform2D } from '$lib/stores/camera.svelte';

function transform(x: number, y: number, k: number): Transform2D {
  return { x, y, k } as Transform2D;
}

function layout(overrides: Partial<AxisLabelLayout> = {}): AxisLabelLayout {
  return {
    cameraTransform: undefined,
    cameraBaseline: undefined,
    width: 500,
    height: 300,
    cameraZoom: 1,
    labels: undefined,
    ...overrides
  };
}

describe('getXLabelX / getYLabelY', () => {
  it('returns the default fallback when there is no camera transform', () => {
    expect(getXLabelX(layout())).toBeCloseTo(6.8);
    expect(getYLabelY(layout())).toBeCloseTo(6.25);
  });

  it('two calls with different baselines are independent (split-view regression)', () => {
    // Use a non-unity zoom so the baseline term doesn't algebraically cancel out,
    // and small enough pan/zoom that results don't clamp to ±GRID_SIZE_2D.
    const t = transform(10, 10, 2);

    const withBaselineA = getXLabelX(layout({ cameraTransform: t, cameraBaseline: { x: 0, y: 0 } }));
    const withBaselineB = getXLabelX(layout({ cameraTransform: t, cameraBaseline: { x: 5, y: 5 } }));

    expect(withBaselineA).not.toBeCloseTo(withBaselineB, 5);

    // Calling with baseline B again yields the same result as before (no shared/mutated state).
    const withBaselineBAgain = getXLabelX(
      layout({ cameraTransform: t, cameraBaseline: { x: 5, y: 5 } })
    );
    expect(withBaselineBAgain).toBeCloseTo(withBaselineB);

    const withBaselineAAgain = getXLabelX(
      layout({ cameraTransform: t, cameraBaseline: { x: 0, y: 0 } })
    );
    expect(withBaselineAAgain).toBeCloseTo(withBaselineA);
  });

  it('uses the center branch when xLabelPosition/yLabelPosition is center', () => {
    const t = transform(0, 0, 1);

    const center = getXLabelX(layout({ cameraTransform: t, labels: { xLabelPosition: 'center' } }));
    const edge = getXLabelX(layout({ cameraTransform: t }));
    expect(center).not.toBeCloseTo(edge, 5);

    const yCenter = getYLabelY(layout({ cameraTransform: t, labels: { yLabelPosition: 'center' } }));
    const yEdge = getYLabelY(layout({ cameraTransform: t }));
    expect(yCenter).not.toBeCloseTo(yEdge, 5);
  });

  it('clamps the result at ±GRID_SIZE_2D', () => {
    const t = transform(1e9, 1e9, 1e-6);

    const x = getXLabelX(layout({ cameraTransform: t }));
    const y = getYLabelY(layout({ cameraTransform: t }));

    expect(Math.abs(x)).toBeLessThanOrEqual(GRID_SIZE_2D);
    expect(Math.abs(y)).toBeLessThanOrEqual(GRID_SIZE_2D);
  });
});
