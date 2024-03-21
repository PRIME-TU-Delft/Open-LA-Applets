import { primeColorArray, type PrimeColor } from './PrimeColors';
import { Slider } from './Slider';
import { Toggle } from './Toggle';

/**
 * Interface for a controller
 * @param T - type of the value
 */
export interface Controller<T> {
  width: number;
  defaultValue: T;
  value: T;
  type: string;

  reset(): Controller<T>;
  toURL(): string;
  fromURL(s: string): Controller<T>;
}

export class Controls<T extends readonly Controller<number | boolean>[]> {
  private readonly _controls: T;
  private _width: number; // width of the controls

  MAX_WIDTH = 100;

  constructor(controls: T, width = 0) {
    this._controls = controls;
    this._width = width;
  }

  get currentWidth() {
    return this._width;
  }

  get controls() {
    return this._controls;
  }

  get length() {
    return this._controls.length;
  }

  *[Symbol.iterator]() {
    yield* this._controls;
  }

  isAllowedToAddControl(control: Controller<number | boolean>) {
    if (this._width + control.width >= this.MAX_WIDTH) {
      throw new Error(
        `Controls width exceeded: ${this._width + control.width} > ${this.MAX_WIDTH}`
      );
    }

    if (this.controls.length >= 5) throw new Error('Controls length exceeded');
  }

  /**
   * add a new slider to the sliders array
   * @param dft - default value for the slider default is 0
   * @param from - from value, default is -1
   * @param to - to value, default is 1
   * @param step - step size, default is 0.1
   * @returns this
   */
  addSlider(
    dft: number,
    from?: number,
    to?: number,
    step?: number,
    color?: PrimeColor,
    label?: string
  ) {
    const sliderColor = color || primeColorArray[this.length % primeColorArray.length];

    const newSlider = new Slider(dft, from, to, step, sliderColor, label);

    this.isAllowedToAddControl(newSlider);

    return new Controls([...this.controls, newSlider] as const, this._width + newSlider.width);
  }

  /**
   * Static method to create set Controls<T> to a new slider
   * @returns
   */
  static addSlider(
    dft: number,
    from?: number,
    to?: number,
    step?: number,
    color?: PrimeColor,
    label?: string
  ) {
    const newSlider = new Slider(dft, from, to, step, color || primeColorArray[0], label);
    return new Controls([newSlider] as const, newSlider.width);
  }

  /**
   * Add a new toggle to the toggles array
   * @param dft - default value for the toggle default is false
   * @returns this
   */
  addToggle(dft: boolean, title?: string, color?: PrimeColor) {
    const newToggle = new Toggle(dft, title, color || primeColorArray[0]);
    this.isAllowedToAddControl(newToggle);
    return new Controls([...this.controls, newToggle] as const, this._width + newToggle.width);
  }

  /**
   * Static method to create set Controls<T> to a new toggle
   * @returns
   */
  static addToggle(dft: boolean, title?: string, color?: PrimeColor) {
    const newToggle = new Toggle(dft, title, color || primeColorArray[0]);
    return new Controls([newToggle] as const, newToggle.width);
  }

  // Reset all sliders to their default values
  reset() {
    this._controls.map((c) => c.reset());

    return this;
  }

  // Are all sliders equal?
  get allSlidersEqualValue() {
    const firstSlider = this._controls.find((c) => c instanceof Slider) as Slider | undefined;

    // If there are no sliders, return true
    if (!firstSlider) return true;

    // Check if all sliders have the same value as the first slider
    return this._controls.every((c) => (c instanceof Slider ? c.value == firstSlider.value : true));
  }

  get values() {
    return this._controls.map((s) => s.value);
  }

  // Get the value of a slider by its index
  private getContolValue(index: number) {
    if (this._controls.length - 1 < index || index < 0) throw new Error('Index out of range');

    return this._controls[index].value;
  }

  // Get the value of the first controller
  get 0(): T[0]['value'] {
    return this.controls[0].value;
  }

  // Get the value of the second controller
  get 1(): T[1]['value'] {
    return this.controls[1].value;
  }

  // Get the value of the third controller
  get 2(): T[2]['value'] {
    return this.controls[2].value;
  }

  // Get the value of the fourth controller
  get 3(): T[3]['value'] {
    return this.controls[3].value;
  }

  // Get the value of the fifth controller
  get 4(): T[4]['value'] {
    return this.controls[4].value;
  }

  hasSliders() {
    return this._controls.filter((c) => c instanceof Slider).length > 0;
  }

  /**
   * @returns a string of the slider values separated by commas
   */
  toURL() {
    return 'controls=' + this._controls.map((c) => c.toURL()).join(',');
  }

  /**
   * Convert a URL string to a set of sliders
   * @param url string to convert
   * @returns this
   */
  fromURL(url: string) {
    if (!url) return this;

    const values = url.split(',').map((v) => parseFloat(v));

    const urlControls = this._controls.map((control, i) => {
      if (i >= values.length) return control;

      return control.fromURL(values[i].toString());
    }) as unknown as T;

    return new Controls(urlControls as T);
  }
}
