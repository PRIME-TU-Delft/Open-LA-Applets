import { describe, it, expect } from 'vitest';
import { Vector2 } from 'three';
import { Projection2D, IDENTITY_PROJECTION } from './Projection2D';

describe('Projection2D', () => {
  const p = new Projection2D(2, 4);

  it('toScreen scales coordinates by scaleX/scaleY', () => {
    const s = p.toScreen(new Vector2(3, 5));
    expect(s.x).toBe(6);
    expect(s.y).toBe(20);
  });

  it('toWorld is the inverse of toScreen', () => {
    const world = new Vector2(3, 5);
    const round = p.toWorld(p.toScreen(world));
    expect(round.x).toBeCloseTo(3);
    expect(round.y).toBeCloseTo(5);
  });

  it('toScreenDir returns a unit vector', () => {
    const d = p.toScreenDir(new Vector2(1, 1));
    expect(d.length()).toBeCloseTo(1);
  });

  it('toScreenDir points along the scaled direction under non-uniform scale', () => {
    const d = p.toScreenDir(new Vector2(1, 1));
    expect(d.angle()).toBeCloseTo(Math.atan2(4, 2));
  });

  it('toScreenDir handles the zero vector without NaN', () => {
    const d = p.toScreenDir(new Vector2(0, 0));
    expect(Number.isNaN(d.x)).toBe(false);
    expect(Number.isNaN(d.y)).toBe(false);
  });

  it('does not mutate its input', () => {
    const input = new Vector2(3, 5);
    p.toScreen(input);
    expect(input.x).toBe(3);
    expect(input.y).toBe(5);
  });

  it('scalar mappings match toScreen/toWorld per axis', () => {
    expect(p.xToScreen(3)).toBe(6);
    expect(p.yToScreen(5)).toBe(20);
    expect(p.xToWorld(6)).toBe(3);
    expect(p.yToWorld(20)).toBe(5);
  });

  it('toScreenFunction maps a world-space function onto screen space', () => {
    const screenSquare = p.toScreenFunction((x) => x * x);
    // screen x 6 -> world x 3 -> world y 9 -> screen y 36
    expect(screenSquare(6)).toBe(36);
  });

  it('toScreenFunction points project back onto the world graph', () => {
    const f = (x: number) => Math.sin(x);
    const screenF = p.toScreenFunction(f);
    const world = p.toWorld(new Vector2(1.3, screenF(1.3)));
    expect(world.y).toBeCloseTo(f(world.x));
  });

  it('IDENTITY_PROJECTION is a no-op', () => {
    const v = new Vector2(7, 9);
    expect(IDENTITY_PROJECTION.toScreen(v)).toEqual(v);
  });
});
