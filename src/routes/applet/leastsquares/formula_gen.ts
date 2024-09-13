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

export function calcTotalDist(u_ts: UT[]) {
  return u_ts
    .map((p) => p.dist)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function formulaLatex(isOrthogonal: boolean, isLeastSquares: boolean) {
  return isOrthogonal
    ? '\\sum_{n=1}^{5} \\mathrm{dist}(\\$1,\\$2) = \\$3'
    : isLeastSquares
      ? '\\sum_{n=1}^{5} |y_n - (ax_n + b_n)|^2  = \\$3 '
      : '\\sum_{n=1}^{5} |y_n - (ax_n + b_n)|^2  = \\$3 ';
}
export function setFormulas(u_ts: UT[], isOrthogonal: boolean, isLeastSquares: boolean) {
  const totalDist = calcTotalDist(u_ts);

  const f2 = new Formula(formulaLatex(isOrthogonal, isLeastSquares))
    .addParam(1, '\\mathcal{P}_n', PrimeColor.orange)
    .addParam(2, '\\mathcal{L}', PrimeColor.cyan)
    .addParam(3, totalDist > 1e5 ? '\\infin' : round(totalDist), PrimeColor.raspberry);
  const formulas = new Formulas(f2).align();

  return formulas;
}
export function distLabelLatex(isOrthogonal: boolean, isLeastSquares: boolean) {
  return isOrthogonal
    ? '\\mathrm{dist}(\\mathcal{P}_4, \\mathcal{L}) \\rightarrow'
    : isLeastSquares
      ? '|y_4 - (ax_4 + b_4)|^2\\rightarrow'
      : '|y_4 - (ax_4 + b_4)| \\rightarrow';
}
