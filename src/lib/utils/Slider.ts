import { PrimeColor } from './PrimeColors';
import { hexToRGB, RGBToHSL } from './colorConvert';
import type { Controller } from './Controls';

/**
 * The Slider class is used to create a slider with a default value and a range of values.
 * The default values are set to 0, -1, 1, and 0.1.
 * The default color is ultramarine.
 *
 * @param defaultValue The default value for the slider
 * @param min The minimum value for the slider
 * @param max The maximum value for the slider
 * @param step The step size for the slider
 * @param color The color of the slider
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

  constructor(
    defaultValue: number,
    min = -1,
    max = 1,
    step = 0.1,
    color: string = PrimeColor.blue
  ) {
    this.defaultValue = defaultValue;
    this.min = min;
    this.max = max;
    this.stepSize = step;
    this.value = defaultValue;
    this.color = color;
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

  colorIndex(num: number) {
    const colors = Object.values(PrimeColor);

    this.color = colors[num];

    return this;
  }

  grey() {
    this.color = PrimeColor.black;
    return this;
  }

  yellow() {
    this.color = PrimeColor.yellow;
    return this;
  }

  blue() {
    this.color = PrimeColor.blue;
    return this;
  }

  pink() {
    this.color = PrimeColor.pink;
    return this;
  }

  darkGreen() {
    this.color = PrimeColor.darkGreen;
    return this;
  }

  red() {
    this.color = PrimeColor.red;
    return this;
  }

  get hsl() {
    const hsl = RGBToHSL(hexToRGB(this.color));
    return hsl;
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

export type SliderArray =
  | readonly []
  | readonly [Slider]
  | readonly [Slider, Slider]
  | readonly [Slider, Slider, Slider];
