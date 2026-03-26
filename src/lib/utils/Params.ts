import { ComputeEngine } from '@cortex-js/compute-engine';

function parseLatexNumeric(latex: string): number {
  const ce = new ComputeEngine();
  const parsed = ce.parse(latex);

  if (!parsed.isValid || parsed.has('Error') || parsed.has('Nothing') || parsed.unknowns.length > 0)
    return NaN;

  return parseFloat(parsed.N() as unknown as string);
}

export function parseNumericalOrLatex(
  str: string | null,
  defaultValue: number
): { value: number; isLatex: boolean } {
  if (str == null) return { value: defaultValue, isLatex: false };

  let res = { value: parseFloat(str), isLatex: false };

  const latexValue = parseLatexNumeric(str);
  if (!isNaN(latexValue)) {
    res = { value: latexValue, isLatex: true };
  }

  if (isNaN(res.value)) {
    return { value: defaultValue, isLatex: false };
  }

  return res;
}
