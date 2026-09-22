import { describe, it, expect } from 'vitest';
import { Vector2 } from 'three';
import {
  MAX_ZOOM_FACTOR,
  VISIBLE_SCENE_WIDTH,
  zoomScaleExtent,
  clampCameraZoom,
  toZoomView,
  fromZoomView
} from './CameraMath';

describe('zoomScaleExtent', () => {
  it('returns the relative overlay bounds around a base zoom', () => {
    expect(zoomScaleExtent(3)).toEqual([3 / MAX_ZOOM_FACTOR, MAX_ZOOM_FACTOR / 3]);
  });
});

describe('clampCameraZoom', () => {
  it.each([
    [3, 5, 5],
    [0.9, 1.4, 1.4],
    [0.9, 100, 6],
    [0.9, 0.01, 0.135]
  ])('clamps target %d to %d given initial zoom %d', (initial, target, expected) => {
    expect(clampCameraZoom(target, initial)).toBeCloseTo(expected, 6);
  });

  it('depends only on initialZoom, not on any previous target', () => {
    const a = clampCameraZoom(100, 0.9);
    const b = clampCameraZoom(a, 0.9);
    expect(b).toBeCloseTo(clampCameraZoom(100, 0.9), 6);
  });
});

describe('toZoomView / fromZoomView', () => {
  it('round-trips position and zoom', () => {
    const cases: Array<[Vector2, number]> = [
      [new Vector2(0, 0), 1],
      [new Vector2(1, 1), 1.4],
      [new Vector2(-2.5, 3), 0.9]
    ];

    for (const [position, zoom] of cases) {
      const view = toZoomView(position, zoom);
      const back = fromZoomView(view);
      expect(back.position.x).toBeCloseTo(position.x, 9);
      expect(back.position.y).toBeCloseTo(position.y, 9);
      expect(back.zoom).toBeCloseTo(zoom, 9);
    }
  });

  it('encodes width as VISIBLE_SCENE_WIDTH / zoom', () => {
    const [, , w] = toZoomView(new Vector2(0, 0), 2);
    expect(w).toBeCloseTo(VISIBLE_SCENE_WIDTH / 2, 9);
  });
});
