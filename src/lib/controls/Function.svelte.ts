import { PrimeColor } from '$lib/utils/PrimeColors';
import type { Controller } from './Controls';

export class Function implements Controller<string> {
  width: number = 30;
  defaultValue: string;
  value: string;
  type: string = 'function';
  label: string;
  color: PrimeColor;

  constructor(defaultFunctionStr: string, label?: string, color?: PrimeColor) {
    this.defaultValue = defaultFunctionStr;
    this.value = defaultFunctionStr;
    this.label = label || '';
    this.color = color || PrimeColor.black;
  }

  reset(_ms?: number, _timeSteps?: number): Controller<string> {
    this.value = this.defaultValue;

    return this;
  }

  functionStr = '';
}
