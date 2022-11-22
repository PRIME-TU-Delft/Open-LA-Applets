import { PrimeColor } from './PrimeColors';

// TODO: add jsdoc & docs website
export class Sliders {
  private _sliders: Slider[];

  constructor() {
    this._sliders = [];
  }

  add(slider: Slider) {
    this._sliders.push(slider);

    return this;
  }

  addSlider(dft: number, from?: number, to?: number, step?: number) {
    if (this._sliders.length >= 3) return this; // Do not exceed 3 sliders

    this._sliders.push(
      Slider.set(dft).from(from).to(to).step(step).colorIndex(this._sliders.length)
    );

    return this;
  }

  reset() {
    this._sliders = this._sliders.map((s) => s.reset());

    return this;
  }

  get allEqual() {
    return this._sliders.every((s) => s.value == this._sliders[0].value);
  }

  get sliders() {
    return this._sliders;
  }

  get values() {
    return this._sliders.map((s) => s.value);
  }

  private getSlider(index: number) {
    if (this._sliders.length < index) return 0;

    return this._sliders[index].value;
  }

  get x() {
    return this.getSlider(0);
  }

  get y() {
    return this.getSlider(1);
  }

  get z() {
    return this.getSlider(2);
  }
}

// TODO: add jsdoc & docs website
export class Slider {
  defaultValue = 0;
  min = -1;
  max = 1;
  stepSize = 0.1;
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
