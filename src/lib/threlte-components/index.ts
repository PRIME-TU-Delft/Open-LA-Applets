import type { Vector3 } from 'three';

export { default as Angle3D } from './Angle.svelte';
export { default as Arc3D } from './Arc.svelte';
export { default as Axis3D } from './Axis.svelte';
export { default as Canvas3D } from './Canvas.svelte';
export { default as Latex3D } from './Latex.svelte';
export { default as Line3D } from './Line.svelte';
export { default as Parallelogram3D } from './Parallelogram.svelte';
export { default as PartialDeconstruction3D } from './PartialDeconstruction.svelte';
export { default as Point3D } from './Point.svelte';
export { default as Vector3D } from './Vector.svelte';

export { AutoPlane, PlaneFromNormal, PlaneFromPoints } from './planes/index';

type SizeCSS =
  | 'auto'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'unset'
  | `${number}%`
  | `${number}px`
  | `${number}rem`
  | `${number}em`
  | `${number}vw`
  | `${number}vh`
  | `${number}vmin`
  | `${number}vmax`;

export type Canvas3DProps = {
  cameraPosition: Vector3;
  cameraZoom: number;
  enablePan: boolean;
  width: SizeCSS;
  height: SizeCSS;
};
