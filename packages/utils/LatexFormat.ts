import type { Vector3 } from 'three';

export function bVector(v: Vector3) {
  return `\\begin{bmatrix} ${v.z} \\\\ ${v.x} \\\\ ${v.y} \\end{bmatrix}`;
}

export function color(param: number | string, color: string) {
  return `\\htmlStyle{color: ${color};}{${param}}`;
}

export function matrix(m: (string | number | undefined)[][]) {
  return `\\begin{bmatrix} ${m.map((row) => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
}
