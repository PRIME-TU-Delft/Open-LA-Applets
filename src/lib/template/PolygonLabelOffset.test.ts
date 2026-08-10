import { describe, expect, it } from 'vitest';
import { Vector2 } from 'three';
import { outwardLabelOffset, outwardSideNormal, POLYGON_LABEL_OFFSET } from './PolygonLabelOffset';

describe('outwardSideNormal', () => {
  it('points away from the centroid for a bottom edge of a square', () => {
    const center = new Vector2(0, 0);
    const pStart = new Vector2(-1, -1);
    const pEnd = new Vector2(1, -1);

    const normal = outwardSideNormal(pStart, pEnd, center);

    expect(normal.x).toBeCloseTo(0);
    expect(normal.y).toBeLessThan(0);
  });

  it('points away from the centroid for a right edge of a square', () => {
    const center = new Vector2(0, 0);
    const pStart = new Vector2(1, -1);
    const pEnd = new Vector2(1, 1);

    const normal = outwardSideNormal(pStart, pEnd, center);

    expect(normal.x).toBeGreaterThan(0);
    expect(normal.y).toBeCloseTo(0);
  });

  it('returns a zero vector for a degenerate (zero-length) edge', () => {
    const center = new Vector2(0, 0);
    const p = new Vector2(1, 1);

    const normal = outwardSideNormal(p, p.clone(), center);

    expect(normal.length()).toBe(0);
  });
});

describe('outwardLabelOffset', () => {
  it('offsets outward by the requested magnitude and aligns bottom-left is not chosen — up-right anchors bottom-left', () => {
    const { offset, alignX, alignY } = outwardLabelOffset(new Vector2(1, 1), POLYGON_LABEL_OFFSET);

    expect(offset.length()).toBeCloseTo(POLYGON_LABEL_OFFSET);
    expect(offset.x).toBeGreaterThan(0);
    expect(offset.y).toBeGreaterThan(0);
    expect(alignX).toBe('left');
    expect(alignY).toBe('bottom');
  });

  it('ties x ≈ 0 to right', () => {
    const { alignX } = outwardLabelOffset(new Vector2(0, 1), POLYGON_LABEL_OFFSET);
    expect(alignX).toBe('right');
  });

  it('ties y ≈ 0 to bottom', () => {
    const { alignY } = outwardLabelOffset(new Vector2(1, 0), POLYGON_LABEL_OFFSET);
    expect(alignY).toBe('bottom');
  });

  it('falls back to a non-zero offset with bottom/right alignment for a zero-length direction', () => {
    const { offset, alignX, alignY } = outwardLabelOffset(new Vector2(0, 0), POLYGON_LABEL_OFFSET);

    expect(offset.length()).toBeCloseTo(POLYGON_LABEL_OFFSET);
    expect(alignX).toBe('right');
    expect(alignY).toBe('bottom');
  });

  it('uses the shared 0.15 magnitude for a known square vertex', () => {
    const center = new Vector2(0, 0);
    const vertex = new Vector2(1, 1);
    const direction = vertex.clone().sub(center);

    const { offset } = outwardLabelOffset(direction, POLYGON_LABEL_OFFSET);

    expect(offset.length()).toBeCloseTo(0.15);
  });
});
