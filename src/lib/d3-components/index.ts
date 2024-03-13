import type { Vector2 } from 'three';
import type { GridType } from './grids/GridTypes';

export { default as Arc2D } from './Arc.svelte';
export { default as Axis2D } from './Axis.svelte';
export { default as Canvas2D } from './Canvas.svelte';
export { default as InfiniteLine2D} from './InfiniteLine.svelte';
export { default as Latex2D } from './Latex.svelte';
export { default as Line2D } from './Line.svelte';
export { default as Point2D } from './Point.svelte';
export { default as RightAngle } from './RightAngle.svelte';
export { default as Vector2D } from './Vector.svelte';
export { default as Draggable2D } from './Draggable.svelte';

export type Canvas2DProps = {
  cameraPosition: Vector2;
  cameraZoom: number;
  width: number;
  height: number;
  tickLength: number;
  gridType: GridType;
};
