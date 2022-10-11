import { PrimeColor } from './primeColors';

export default class Slider {
  defaultValue = 0;
  min = -1;
  max = 1;
  step = 0.1;
  value = 0;
  color: string = PrimeColor.ultramarine;

  constructor(
    defaultValue: number,
    min = -1,
    max = 1,
    step = 0.1,
    color: string = PrimeColor.ultramarine
  ) {
    this.defaultValue = defaultValue;
    this.min = min;
    this.max = max;
    this.step = step;
    this.value = defaultValue;
    this.color = color;
  }

  static Default = new Slider(0);

  grey() {
    this.color = PrimeColor.grey;
    return this;
  }

  yellow() {
    this.color = PrimeColor.yellow;
    return this;
  }

  blue() {
    this.color = PrimeColor.ultramarine;
    return this;
  }

  pink() {
    this.color = PrimeColor.pink;
    return this;
  }

  green() {
    this.color = PrimeColor.green;
    return this;
  }

  red() {
    this.color = PrimeColor.red;
    return this;
  }

  reset() {
    this.value = this.defaultValue;

    return this;
  }
}

export type SliderArray =
  | readonly []
  | readonly [Slider]
  | readonly [Slider, Slider]
  | readonly [Slider, Slider, Slider];
