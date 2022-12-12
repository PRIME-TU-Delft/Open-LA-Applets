import type { Vector3 } from 'three';

export function bVector(v: Vector3) {
  return `\\begin{bmatrix} ${v.z} \\\\ ${v.x} \\\\ ${v.y} \\end{bmatrix}`;
}
