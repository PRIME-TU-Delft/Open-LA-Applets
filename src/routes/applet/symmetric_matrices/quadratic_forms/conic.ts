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
  xFunc: (t: number) => number;
  yFunc: (t: number) => number;
  xFunc2?: (t: number) => number;
  yFunc2?: (t: number) => number;
  line?: boolean;
} | null {
  const delta = b * b - 4 * a * c;
  const angle = 0.5 * Math.atan2(b, a - c);
  const cos_angle = Math.cos(angle);
  const sin_angle = Math.sin(angle);

  const trace = a + c;
  const det = a * c - (b / 2) ** 2;
  const eigenVal1 = trace / 2 + Math.sqrt(trace ** 2 / 4 - det);
  const eigenVal2 = trace / 2 - Math.sqrt(trace ** 2 / 4 - det);

  if (delta < 0) {
    // Ellipse case
    if (d === 0) {
      // A single point at the origin
      return { xFunc: (_t) => 0, yFunc: (_t) => 0 };
    }

    const u_coeff = Math.sqrt(d / eigenVal1);
    const v_coeff = Math.sqrt(d / eigenVal2);

    const uFunc = (t: number) => u_coeff * Math.cos(t);
    const vFunc = (t: number) => v_coeff * Math.sin(t);

    return {
      xFunc: (t) => uFunc(t) * cos_angle - vFunc(t) * sin_angle,
      yFunc: (t) => uFunc(t) * sin_angle + vFunc(t) * cos_angle
    };
  } else if (delta > 0) {
    // Hyperbola case
    if (d === 0) {
      // Degenerate hyperbola: two intersecting lines.
      // eigenVal1 > 0, eigenVal2 < 0
      const slope = Math.sqrt(-eigenVal2 / eigenVal1);
      const uFunc1 = (t: number) => slope * t;
      const vFunc1 = (t: number) => t;
      const uFunc2 = (t: number) => -slope * t;
      const vFunc2 = (t: number) => t;

      const xFunc = (t: number) => uFunc1(t) * cos_angle - vFunc1(t) * sin_angle;
      const yFunc = (t: number) => uFunc1(t) * sin_angle + vFunc1(t) * cos_angle;
      const xFunc2 = (t: number) => uFunc2(t) * cos_angle - vFunc2(t) * sin_angle;
      const yFunc2 = (t: number) => uFunc2(t) * sin_angle + vFunc2(t) * cos_angle;

      return { xFunc, yFunc, xFunc2, yFunc2, line: true };
    }

    if (d < 0) {
      // d < 0. Case corresponding to v^2/B^2 - u^2/A^2 = 1
      const u_coeff = Math.sqrt(-d / eigenVal1);
      const v_coeff = Math.sqrt(d / eigenVal2);
      const uFunc = (t: number) => u_coeff * Math.sinh(t);
      const vFunc = (t: number) => v_coeff * Math.cosh(t);

      const xFunc = (t: number) => uFunc(t) * cos_angle - vFunc(t) * sin_angle;
      const yFunc = (t: number) => uFunc(t) * sin_angle + vFunc(t) * cos_angle;
      const xFunc2 = (t: number) => uFunc(t) * cos_angle + vFunc(t) * sin_angle;
      const yFunc2 = (t: number) => uFunc(t) * sin_angle - vFunc(t) * cos_angle;

      return { xFunc, yFunc, xFunc2, yFunc2 };
    }

    const u_coeff = Math.sqrt(d / eigenVal1);
    const v_coeff = Math.sqrt(Math.abs(d / eigenVal2));
    const uFunc = (t: number) => u_coeff * Math.cosh(t);
    const vFunc = (t: number) => v_coeff * Math.sinh(t);

    return {
      xFunc: (t) => uFunc(t) * cos_angle - vFunc(t) * sin_angle,
      yFunc: (t) => uFunc(t) * sin_angle + vFunc(t) * cos_angle,
      xFunc2: (t) => -uFunc(t) * cos_angle - vFunc(t) * sin_angle,
      yFunc2: (t) => -uFunc(t) * sin_angle + vFunc(t) * cos_angle
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
      let uFunc = (t: number) => t;
      let vFunc = (_t: number) => 0;
      if (trace > 0) {
        // eigenVal1 = trace, eigenVal2 = 0. Equation: trace * u^2 = 0 -> u=0
        uFunc = (_t: number) => 0;
        vFunc = (t: number) => t;
      }
      // else trace < 0, eigenVal1 = 0, eigenVal2 = trace. Equation: trace * v^2 = 0 -> v=0

      return {
        xFunc: (t) => uFunc(t) * cos_angle - vFunc(t) * sin_angle,
        yFunc: (t) => uFunc(t) * sin_angle + vFunc(t) * cos_angle,
        line: true
      };
    }

    // Two parallel lines
    const const_val = Math.sqrt(d_div_trace);
    let uFunc1 = (t: number) => t;
    let vFunc1 = (_t: number) => const_val;
    let uFunc2 = (t: number) => t;
    let vFunc2 = (_t: number) => -const_val;

    if (trace > 0) {
      // u = +/- const_val, v = t
      uFunc1 = (_t: number) => const_val;
      vFunc1 = (t: number) => t;
      uFunc2 = (_t: number) => -const_val;
      vFunc2 = (t: number) => t;
    }
    // else trace < 0, v = +/- const_val, u = t, which is the default

    const xFunc = (t: number) => uFunc1(t) * cos_angle - vFunc1(t) * sin_angle;
    const yFunc = (t: number) => uFunc1(t) * sin_angle + vFunc1(t) * cos_angle;
    const xFunc2 = (t: number) => uFunc2(t) * cos_angle - vFunc2(t) * sin_angle;
    const yFunc2 = (t: number) => uFunc2(t) * sin_angle + vFunc2(t) * cos_angle;

    return { xFunc, yFunc, xFunc2, yFunc2, line: true };
  }
}

export { parameterizeConic };
