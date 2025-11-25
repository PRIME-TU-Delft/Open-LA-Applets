import { PrimeColor } from '$lib/utils/PrimeColors';
import { Parser, type Expression } from 'expr-eval';
import type { Controller } from './Controls';

export class Function implements Controller<Expression> {
  parser = new Parser();

  functionString: string = $state('0');
  defaultString: string;

  width: number = 30;
  defaultValue: Expression;
  private previousValue: Expression | null = null;

  private parseResult = $derived.by(() => {
    try {
      const parsed = this.parser.parse(this.functionString);
      this.previousValue = parsed;
      return { value: parsed, isError: false };
    } catch (_error) {
      return { value: this.previousValue || this.defaultValue, isError: true };
    }
  });

  value: Expression = $derived(this.parseResult.value);
  isError: boolean = $derived(this.parseResult.isError);
  type: string = 'function';
  label: string;
  color: PrimeColor;

  constructor(defaultFunctionStr: string, label?: string, color?: PrimeColor) {
    this.defaultString = defaultFunctionStr;
    this.functionString = defaultFunctionStr;
    this.defaultValue = this.parser.parse(defaultFunctionStr);
    this.value = this.defaultValue;
    this.label = label || '';
    this.color = color || PrimeColor.black;
  }

  reset(_ms?: number, _timeSteps?: number): Controller<Expression> {
    this.value = this.defaultValue;
    this.functionString = this.defaultString;

    return this;
  }
}
