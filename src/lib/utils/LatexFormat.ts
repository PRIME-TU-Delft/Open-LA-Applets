import type { Vector3 } from 'three';
import katex from 'katex';

export function bVector(v: Vector3) {
  return `\\begin{bmatrix} ${v.z} \\\\ ${v.x} \\\\ ${v.y} \\end{bmatrix}`;
}

export function color(param: number | string, color: string) {
  return `\\htmlStyle{color: ${color};}{${param}}`;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function convertLatex(latex: string, params: (string | number)[], colors: string[]) {
  let str = '';
  let input = latex;

  try {
    // Replace the parameters in the string with the values given by the user
    for (let i = 0; i < params.length; i++) {
      const value = parseFloat('' + params[i]).toFixed(2) || params[i];

      input = input.replaceAll(
        '\\$' + i,
        `\\htmlStyle{color: ${colors[i % colors.length]};}{${value}}`
      );
    }

    // For reference: https://katex.org/docs/options.html
    str = katex.renderToString(input, {
      displayMode: true,
      leqno: false,
      fleqn: false,
      throwOnError: true,
      output: 'html',
      trust: true,
      strict: false
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    str = e.message;
  }
  return str;
}