/**
 * Takes a quadratic form: a x^2 + b xy + c y^2 = d
 * @param a x^2 coefficient
 * @param b xy coefficient
 * @param c y^2 cofficient
 * @param d constant coefficient
 * @returns Parametrization of the equation
 */
function parameterizeConic(
  a: number,
  b: number,
  c: number,
  d: number
): {
  xFunc: string;
  yFunc: string;
  xFunc2?: string;
  yFunc2?: string;
  line?: boolean;
} | null {
  const delta = b * b - 4 * a * c;
  const angle = 0.5 * Math.atan2(b, a - c);
  const cos = `cos(${angle.toFixed(6)})`;
  const sin = `sin(${angle.toFixed(6)})`;

  const trace = a + c;
  const det = a * c - (b / 2) ** 2;
  const eigenVal1 = trace / 2 + Math.sqrt(trace ** 2 / 4 - det);
  const eigenVal2 = trace / 2 - Math.sqrt(trace ** 2 / 4 - det);

  if (delta < 0) {
    // Ellipse case
    const uExpr = `sqrt(${d / eigenVal1}) * cos(t)`;
    const vExpr = `sqrt(${d / eigenVal2}) * sin(t)`;

    if (d === 0) {
      // A single point at the origin
      return { xFunc: '0', yFunc: '0' };
    }

    return {
      xFunc: `(${uExpr}) * ${cos} - (${vExpr}) * ${sin}`,
      yFunc: `(${uExpr}) * ${sin} + (${vExpr}) * ${cos}`
    };
  } else if (delta > 0) {
    // Hyperbola case
    const uExpr = `sqrt(${d / eigenVal1}) * cosh(t)`;
    const vExpr = `sqrt(${Math.abs(d / eigenVal2)}) * sinh(t)`;

    if (d === 0) {
      // Degenerate hyperbola: two intersecting lines.
      // eigenVal1 > 0, eigenVal2 < 0
      const slope = `sqrt(${-eigenVal2 / eigenVal1})`;
      const uExpr1 = `${slope} * t`;
      const vExpr1 = 't';
      const uExpr2 = `-${slope} * t`;
      const vExpr2 = 't';

      const xFunc = `(${uExpr1}) * ${cos} - (${vExpr1}) * ${sin}`;
      const yFunc = `(${uExpr1}) * ${sin} + (${vExpr1}) * ${cos}`;
      const xFunc2 = `(${uExpr2}) * ${cos} - (${vExpr2}) * ${sin}`;
      const yFunc2 = `(${uExpr2}) * ${sin} + (${vExpr2}) * ${cos}`;

      return { xFunc, yFunc, xFunc2, yFunc2, line: true };
    }

    if (d < 0) {
      // d < 0. Case corresponding to v^2/B^2 - u^2/A^2 = 1
      const uExpr = `sqrt(${-d / eigenVal1}) * sinh(t)`;
      const vExpr = `sqrt(${d / eigenVal2}) * cosh(t)`;

      const xFunc = `(${uExpr}) * ${cos} - (${vExpr}) * ${sin}`;
      const yFunc = `(${uExpr}) * ${sin} + (${vExpr}) * ${cos}`;
      const xFunc2 = `(${uExpr}) * ${cos} + (${vExpr}) * ${sin}`;
      const yFunc2 = `(${uExpr}) * ${sin} - (${vExpr}) * ${cos}`;

      return { xFunc, yFunc, xFunc2, yFunc2 };
    }

    return {
      xFunc: `(${uExpr}) * ${cos} - (${vExpr}) * ${sin}`,
      yFunc: `(${uExpr}) * ${sin} + (${vExpr}) * ${cos}`,
      xFunc2: `(-${uExpr}) * ${cos} - (${vExpr}) * ${sin}`,
      yFunc2: `(-${uExpr}) * ${sin} + (${vExpr}) * ${cos}`
    };
  } else {
    // delta = 0, Parabolic case (degenerate)

    if (trace === 0) {
      // 0 = d
      return null;
    }

    const d_div_trace = d / trace;

    if (d_div_trace < 0) {
      return null;
    }

    if (d_div_trace === 0) {
      // d = 0, degenerate conic: a single line
      let uExpr = 't';
      let vExpr = '0';
      if (trace > 0) {
        // eigenVal1 = trace, eigenVal2 = 0. Equation: trace * u^2 = 0 -> u=0
        uExpr = '0';
        vExpr = 't';
      }
      // else trace < 0, eigenVal1 = 0, eigenVal2 = trace. Equation: trace * v^2 = 0 -> v=0

      return {
        xFunc: `(${uExpr}) * ${cos} - (${vExpr}) * ${sin}`,
        yFunc: `(${uExpr}) * ${sin} + (${vExpr}) * ${cos}`,
        line: true
      };
    }

    // Two parallel lines
    const const_val = `sqrt(${d_div_trace})`;
    let uExpr1 = 't';
    let vExpr1 = const_val;
    let uExpr2 = 't';
    let vExpr2 = `-${const_val}`;

    if (trace > 0) {
      // u = +/- const_val, v = t
      uExpr1 = const_val;
      vExpr1 = 't';
      uExpr2 = `-${const_val}`;
      vExpr2 = 't';
    }
    // else trace < 0, v = +/- const_val, u = t, which is the default

    const xFunc = `(${uExpr1}) * ${cos} - (${vExpr1}) * ${sin}`;
    const yFunc = `(${uExpr1}) * ${sin} + (${vExpr1}) * ${cos}`;
    const xFunc2 = `(${uExpr2}) * ${cos} - (${vExpr2}) * ${sin}`;
    const yFunc2 = `(${uExpr2}) * ${sin} + (${vExpr2}) * ${cos}`;

    return { xFunc, yFunc, xFunc2, yFunc2, line: true };
  }
}

export { parameterizeConic };
