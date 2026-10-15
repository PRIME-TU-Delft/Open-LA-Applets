import { untrack } from 'svelte';
import type { ScreenWindow } from './CameraView2D';

export type SampledDomain = ScreenWindow & { zoom: number };

const MARGIN = 1.5;
const EPS = 1e-9;

const clampWin = (w: ScreenWindow, c: ScreenWindow): ScreenWindow => ({
  xMin: Math.max(w.xMin, c.xMin),
  xMax: Math.min(w.xMax, c.xMax),
  yMin: Math.max(w.yMin, c.yMin),
  yMax: Math.min(w.yMax, c.yMax)
});

function grow(lo: number, hi: number, cLo: number, cHi: number): [number, number] {
  const mid = (lo + hi) / 2;
  const half = ((hi - lo) / 2) * MARGIN;
  return [Math.max(mid - half, cLo), Math.min(mid + half, cHi)];
}

function expand(vis: ScreenWindow, zoom: number, c: ScreenWindow): SampledDomain {
  const [xMin, xMax] = grow(vis.xMin, vis.xMax, c.xMin, c.xMax);
  const [yMin, yMax] = grow(vis.yMin, vis.yMax, c.yMin, c.yMax);
  return { xMin, xMax, yMin, yMax, zoom };
}

export function createResampleDomain(
  getWindow: () => ScreenWindow,
  getZoom: () => number,
  getClamp: () => ScreenWindow,
  axes: 'x' | 'xy' = 'x'
) {
  let sampled = $state<SampledDomain>(
    untrack(() => expand(clampWin(getWindow(), getClamp()), getZoom(), getClamp()))
  );

  $effect.pre(() => {
    const c = getClamp();
    const vis = clampWin(getWindow(), c);
    const z = getZoom();

    untrack(() => {
      const xOk = vis.xMin >= sampled.xMin - EPS && vis.xMax <= sampled.xMax + EPS;
      const yOk =
        axes === 'x' || (vis.yMin >= sampled.yMin - EPS && vis.yMax <= sampled.yMax + EPS);
      const withinClamp = sampled.xMin >= c.xMin - EPS && sampled.xMax <= c.xMax + EPS;
      const ratio = z / sampled.zoom;

      if (xOk && yOk && withinClamp && ratio > 0.5 && ratio < 2) return;
      sampled = expand(vis, z, c);
    });
  });

  return {
    get value() {
      return sampled;
    }
  };
}
