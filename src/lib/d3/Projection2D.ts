import { getContext, setContext } from 'svelte';
import { Vector2 } from 'three';

/**
 * The world↔screen seam for 2D applets.
 *
 * - World space: the mathematical coordinates applet authors write (positions,
 *   formulas, domains, a Circle2D radius).
 * - Screen space: SVG units inside the canvas, before the camera transform.
 *
 * Scale applies to world coordinates and world extents. It never applies to
 * screen-space sizes (stroke widths, point radii, arrowheads, label offsets).
 *
 * CanvasD3 publishes one projection via setProjection2D(). Primitives read it with
 * getProjection2D(), take world coordinates as props and project them once.
 * Containers hand their children world coordinates too, so no subtree ever needs
 * a different projection.
 */
export class Projection2D {
  constructor(
    private readonly scaleX: number,
    private readonly scaleY: number
  ) {}

  /** World point → screen point. */
  toScreen(p: Vector2): Vector2 {
    return new Vector2(this.xToScreen(p.x), this.yToScreen(p.y));
  }

  /** Screen point → world point (inverse; for drag input). */
  toWorld(p: Vector2): Vector2 {
    return new Vector2(this.xToWorld(p.x), this.yToWorld(p.y));
  }

  /** World x-coordinate (or x-extent) → screen. */
  xToScreen(x: number): number {
    return x * this.scaleX;
  }

  /** World y-coordinate (or y-extent) → screen. */
  yToScreen(y: number): number {
    return y * this.scaleY;
  }

  /** Screen x-coordinate → world. */
  xToWorld(x: number): number {
    return x / this.scaleX;
  }

  /** Screen y-coordinate → world. */
  yToWorld(y: number): number {
    return y / this.scaleY;
  }

  /** World direction → UNIT direction in screen space. Zero-safe. */
  toScreenDir(d: Vector2): Vector2 {
    const screen = this.toScreen(d);
    const len = screen.length();
    return len === 0 ? screen : screen.divideScalar(len);
  }

  /**
   * World angle → screen angle, in radians. Continuous: sweeping worldAngle
   * monotonically sweeps the result monotonically too, so callers can pass
   * negative angles or angles beyond a full turn (e.g. an arc's start/end
   * angle) without the result snapping backward at a 2π boundary.
   *
   * No-op when scaleX === scaleY (in particular at scale 1).
   */
  toScreenAngle(worldAngle: number): number {
    const TAU = 2 * Math.PI;
    const turns = Math.floor(worldAngle / TAU);
    const wrapped = worldAngle - turns * TAU; // in [0, TAU)
    const screenWrapped = Math.atan2(
      this.scaleY * Math.sin(wrapped),
      this.scaleX * Math.cos(wrapped)
    );
    const screenWrapped0to2pi = screenWrapped < 0 ? screenWrapped + TAU : screenWrapped;
    return screenWrapped0to2pi + turns * TAU;
  }

  /**
   * World-space function y = f(x) → the same curve as a screen-space function.
   * Plotters sample it in screen units, so the step size is even on screen.
   */
  toScreenFunction(f: (x: number) => number): (screenX: number) => number {
    return (screenX) => this.yToScreen(f(this.xToWorld(screenX)));
  }
}

export const IDENTITY_PROJECTION = new Projection2D(1, 1);

const PROJECTION_KEY = 'projection2D';

/** Publishes the canvas projection. Called once, by CanvasD3. */
export function setProjection2D(projection: Projection2D): void {
  setContext(PROJECTION_KEY, projection);
}

export function getProjection2D(): Projection2D {
  return (getContext(PROJECTION_KEY) as Projection2D | undefined) ?? IDENTITY_PROJECTION;
}
