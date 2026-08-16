import { getContext, setContext } from 'svelte';
import { Vector2 } from 'three';

/**
 * The world↔screen seam for 2D applets. Scale applies to COORDINATES, never to
 * sizes (radii, stroke widths, arrowheads). Construct one in CanvasD3 and read
 * it in primitives via getProjection2D().
 */
export class Projection2D {
  constructor(
    public readonly scaleX: number,
    public readonly scaleY: number
  ) {}

  /** World point → screen point. */
  toScreen(p: Vector2): Vector2 {
    return new Vector2(p.x * this.scaleX, p.y * this.scaleY);
  }

  /** Screen point → world point (inverse; for drag input). */
  toWorld(p: Vector2): Vector2 {
    return new Vector2(p.x / this.scaleX, p.y / this.scaleY);
  }

  /** World direction → UNIT direction in screen space. Zero-safe. */
  toScreenDir(d: Vector2): Vector2 {
    const screen = new Vector2(d.x * this.scaleX, d.y * this.scaleY);
    const len = screen.length();
    return len === 0 ? screen : screen.divideScalar(len);
  }
}

export const IDENTITY_PROJECTION = new Projection2D(1, 1);

const PROJECTION_KEY = 'projection2D';

export function setProjection2D(projection: Projection2D): void {
  setContext(PROJECTION_KEY, projection);
}

export function getProjection2D(): Projection2D {
  return (getContext(PROJECTION_KEY) as Projection2D | undefined) ?? IDENTITY_PROJECTION;
}
