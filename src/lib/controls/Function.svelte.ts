import { PrimeColor } from '$lib/utils/PrimeColors';
import type { Controller } from './Controls';
import { ComputeEngine, type BoxedExpression } from '@cortex-js/compute-engine';

export class Function implements Controller<BoxedExpression> {
  private static ce = new ComputeEngine();

  functionString: string = $state('0');
  defaultString: string;

  width: number = 30;
  defaultValue: BoxedExpression;
  private previousValue: BoxedExpression | null = null;

  private parseResult = $derived.by(() => {
    try {
      const parsed = Function.ce.parse(this.functionString);

      if (!parsed.isValid || parsed.has('Error') || parsed.has('Nothing')) {
        return { value: this.previousValue || this.defaultValue, isError: true };
      }

      const unknowns = parsed.unknowns;
      const hasOnlyX = unknowns.every((v) => v === 'x');

      if (!hasOnlyX) {
        return { value: this.previousValue || this.defaultValue, isError: true };
      }

      this.previousValue = parsed;
      return { value: parsed, isError: false };
    } catch (_error) {
      return { value: this.previousValue || this.defaultValue, isError: true };
    }
  });

  value: BoxedExpression = $derived(this.parseResult.value);
  isError: boolean = $derived(this.parseResult.isError);
  type: string = 'function';
  label: string;
  color: PrimeColor;

  constructor(defaultFunctionStr: string, label?: string, color?: PrimeColor) {
    this.defaultValue = Function.ce.parse(defaultFunctionStr);

    this.defaultString = defaultFunctionStr;
    this.functionString = defaultFunctionStr;
    this.label = label || '';
    this.color = color || PrimeColor.black;
  }

  /**
   * Evaluate the function at a given x value
   * @param expression - Expression to evaluate
   * @param x - The x value to evaluate at
   * @returns The numerical result (returns NaN on error)
   */
  static evaluateAt(expression: BoxedExpression, x: number): number {
    try {
      const result = expression.subs({ x: Function.ce.number(x) }).N();
      const numValue = result.valueOf();
      return typeof numValue === 'number' && isFinite(numValue) ? numValue : NaN;
    } catch {
      return NaN;
    }
  }

  /**
   * Get a callable function that evaluates this expression
   * @param expression - Expression to evaluate
   * @returns A function (x: number) => number
   */
  static asFunction(expression: BoxedExpression): (x: number) => number {
    return (x: number) => Function.evaluateAt(expression, x);
  }

  reset(_ms?: number, _timeSteps?: number): Controller<BoxedExpression> {
    this.functionString = this.defaultString;
    return this;
  }
}
