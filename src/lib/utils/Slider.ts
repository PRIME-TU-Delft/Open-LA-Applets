import katex from 'katex';
import type { Controller } from './Controls';
import { convertAndFormatLatex } from './LatexFormat';
import { PrimeColor } from './PrimeColors';

/**
 * The Slider class is used to create a slider with a default value and a range of values.
 * The default values are set to 0, -1, 1, and 0.1.
 * The default color is ultramarine.
 *
 * @param defaultValue The default value for the slider
 * @param min The minimum value for the slider
 * @param max The maximum value for the slider
 * @param step The step size for the slider
 * @param color The color of the slider default is blue
 */

export class Slider implements Controller<number> {
  defaultValue = 0;
  value = 0;
  min = -1;
  max = 1;
  stepSize = 0.1;
  color: string = PrimeColor.blue;
  width = 30;
  type = 'sliders';
  label = '';
  valueFn: (v: number) => string;
  loops = false;

  constructor(
    defaultValue: number,
    min = -1,
    max = 1,
    step = 0.1,
    color: string = PrimeColor.blue,
    label: string = '',
    valueFn: (v: number) => string = (v) => v.toString(),
    loops: boolean = false
  ) {
    this.defaultValue = defaultValue;
    this.min = min;
    this.max = max;
    this.stepSize = step;
    this.value = defaultValue;
    this.color = color;
    this.label = label;
    this.valueFn = valueFn;
    this.loops = loops;
  }

  static Default = new Slider(0);

  static set(dft = 0) {
    return new Slider(dft);
  }

  from(min = -1) {
    this.min = min;

    return this;
  }

  to(max = 1) {
    this.max = max;

    return this;
  }

  step(stp = 0.1) {
    this.stepSize = stp;

    return this;
  }

  reset() {
    this.value = this.defaultValue;

    return this;
  }

  toURL() {
    return `${this.value}`;
  }

  fromURL(s: string) {
    this.value = parseFloat(s);

    return this;
  }
}
