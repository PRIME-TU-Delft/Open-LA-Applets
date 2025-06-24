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
} | null {
    // For ellipses:
    // const D = 4 * a * c - (b*b);

    // const xFunc = `sqrt(${d}/${a}) * (sin(t) - ${b}/sqrt(${D}) * cos(t))`;
    // const yFunc = `( 2 * sqrt(${a}*${d}) / sqrt(${D}) ) * cos(t)`;

    // return { xFunc, yFunc };

    const delta = b * b - 4 * a * c;
    const angle = 0.5 * Math.atan2(b, a - c);
    const cos = `cos(${angle.toFixed(6)})`;
    const sin = `sin(${angle.toFixed(6)})`;

    const trace = a + c;
    const det = a * c - (b / 2) ** 2;
    const eigenVal1 = trace / 2 + Math.sqrt(trace ** 2 / 4 - det);
    const eigenVal2 = trace / 2 - Math.sqrt(trace ** 2 / 4 - det);

    if (delta < 0) {
        // Ellipse
        const uExpr = `sqrt(${d / eigenVal1}) * cos(t)`;
        const vExpr = `sqrt(${d / eigenVal2}) * sin(t)`;
        return {
            xFunc: `(${uExpr}) * ${cos} - (${vExpr}) * ${sin}`,
            yFunc: `(${uExpr}) * ${sin} + (${vExpr}) * ${cos}`
        };
    } else if (delta > 0) {
        // Hyperbola — two branches!
        const uExpr = `sqrt(${d / eigenVal1}) * cosh(t)`;
        const vExpr = `sqrt(${Math.abs(d / eigenVal2)}) * sinh(t)`;

        return {
            xFunc: `(${uExpr}) * ${cos} - (${vExpr}) * ${sin}`,
            yFunc: `(${uExpr}) * ${sin} + (${vExpr}) * ${cos}`,
            xFunc2: `(-${uExpr}) * ${cos} - (${vExpr}) * ${sin}`,
            yFunc2: `(-${uExpr}) * ${sin} + (${vExpr}) * ${cos}`
        };
    } else {
        console.error('Parabola or degenerate conic not yet supported');
        return null; //! Parabola or degenerate conic not supported in this version.
    }
}

export { parameterizeConic };
