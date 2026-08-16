import { describe, it, expect } from 'vitest';
import { createAxisLabels } from '$lib/d3/AxisLabels';
import type { Transform2D } from '$lib/stores/camera.svelte';

function makeTransform(x: number, y: number, k: number): Transform2D {
  return Object.assign([x, y, k], { x, y, k }) as Transform2D;
}
describe('AxisLabels baseline isolation', () => {
  it('does not leak baseline state between independent instances', () => {
    const calcA = createAxisLabels();
    const calcB = createAxisLabels();

    calcA.getXLabelX(makeTransform(500, 0, 1), 800, 1, undefined);

    const calcC = createAxisLabels();

    const resultB = calcB.getXLabelX(makeTransform(0, 0, 1), 800, 1, undefined);
    const resultC = calcC.getXLabelX(makeTransform(0, 0, 1), 800, 1, undefined);

    expect(resultB).toBe(resultC);
  });

  it('captures baseline independently per instance on first call', () => {
    const calc = createAxisLabels();

    const first = calc.getXLabelX(makeTransform(42, 0, 1), 800, 1, undefined);
    const second = calc.getXLabelX(makeTransform(42, 0, 1), 800, 1, undefined);

    expect(second).toBe(first);
  });
});
