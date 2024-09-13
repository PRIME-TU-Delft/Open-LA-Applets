// This file exsits to reduce code duplication in the applets of this section

import { Formula, Formulas } from '$lib/utils/Formulas';
import { lineLineIntersection, orthogonalProjectionWithOffset, round } from '$lib/utils/MathLib';
import { PrimeColor } from '$lib/utils/PrimeColors';
import { Vector2 } from 'three';

type UT = {
  p: Vector2;
  pt: Vector2;
  dist: number;
};

export function projectPoints(
  ps: Vector2[],
  isOrthogonal: boolean,
  isLeastSquares: boolean,
  dir_L_1: Vector2,
  dir_L: Vector2
) {
  return ps.map((p) => {
    let pt: Vector2;
    if (isOrthogonal) {
      pt = orthogonalProjectionWithOffset(p, dir_L_1, dir_L);
    } else {
      pt = projectInY(p, dir_L_1, dir_L);
    }

    let dist = p.clone().sub(pt).length();
    if (isLeastSquares) dist = dist * dist;

    return { p, pt, dist };
  });
}

//non orth proj funct
function projectInY(p: Vector2, origin_L: Vector2, dir_L: Vector2) {
  return lineLineIntersection(
    new Vector2(p.x, 100),
    new Vector2(p.x, -100),
    dir_L.clone().multiplyScalar(20).add(origin_L),
    dir_L.clone().multiplyScalar(-20).add(origin_L)
  );
}
