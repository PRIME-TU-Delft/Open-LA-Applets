import { PrimeColor, type ColorString } from '$lib/utils/PrimeColors';
import { Slider } from './Slider.svelte';
import { Toggle } from './Toggle.svelte';

/**
 * Interface for a controller
 * @param T - type of the value
 */
export interface Controller<T> {
  width: number;
  defaultValue: T;
  value: T;
  type: string;

  reset(ms?: number, timeSteps?: number): Controller<T>;
  toURL(): string;
  fromURL(s: string): Controller<T>;
}

export class Controls<T extends readonly Controller<number | boolean>[]> {
  private readonly _controls: T;
  _width: number; // width of the controls

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

  getAll() {
    return this._controls.map((c) => c);
  }

  isAllowedToAddControl(control: Controller<number | boolean>) {
    if (this._width + control.width > this.MAX_WIDTH) {
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
    color?: ColorString,
    label?: string,
    valueFn?: (v: number) => string
  ) {
    const colors = PrimeColor.asArray();
    const sliderColor = color || colors[this.length % colors.length];

    const newSlider = new Slider(dft, from, to, step, sliderColor, label, valueFn);

    this.isAllowedToAddControl(newSlider);

    return new Controls([...this.controls, newSlider] as const, this._width + newSlider.width);
  }

  /**
   * Static method to create set Controls<T> to a new slider
   * @param dft - default value for the slider default is 0
   * @param from - from value, default is -1
   * @param to - to value, default is 1
   * @param step - step size, default is 0.1
   * @param color - color for the slider default is raspberry
   * @param label - label for the slider
   * @param valueFn - function to format the value
   * @returns
   */
  static addSlider(
    dft: number,
    from?: number,
    to?: number,
    step?: number,
    color: ColorString = PrimeColor.getColor(0),
    label?: string,
    valueFn?: (v: number) => string
  ) {
    const newSlider = new Slider(dft, from, to, step, color, label, valueFn);
    return new Controls([newSlider] as const, newSlider.width);
  }

  /**
   * Add a new toggle to the toggles array
   * @param dft - default value for the toggle default is false
   * @param title - title for the toggle
   * @param color - color for the toggle default is raspberry
   * @returns this
   */
  addToggle(dft: boolean, title?: string, color: ColorString = PrimeColor.getColor(0)) {
    const newToggle = new Toggle(dft, title, color);
    this.isAllowedToAddControl(newToggle);
    return new Controls([...this.controls, newToggle] as const, this._width + newToggle.width);
  }

  /**
   * Static method to create set Controls<T> to a new toggle
   * @param dft - default value for the toggle default is false
   * @param title - title for the toggle
   * @param color - color for the toggle default is raspberry
   * @returns
   */
  static addToggle(dft: boolean, title?: string, color: ColorString = PrimeColor.getColor(0)) {
    const newToggle = new Toggle(dft, title, color);
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
    // Type adapted from https://stackoverflow.com/a/51679156
    type MaybeType<K> = K extends Controller<infer MaybeType> ? MaybeType : never;
    type Unwrapped<Tuple extends readonly [...unknown[]]> = {
      [Index in keyof Tuple]: MaybeType<Tuple[Index]>;
    } & { length: Tuple['length'] };

    return this._controls.map((s) => s.value) as Unwrapped<T>;
  }

  // Get the value of the first controller
  get 0(): T[0]['value'] {
    return this.controls[0].value;
  }

  set 0(value: T[0]['value']) {
    this.controls[0].value = value;
  }

  // Get the value of the second controller
  get 1(): T[1]['value'] {
    return this.controls[1].value;
  }

  set 1(value: T[1]['value']) {
    this.controls[1].value = value;
  }

  // Get the value of the third controller
  get 2(): T[2]['value'] {
    return this.controls[2].value;
  }

  set 2(value: T[2]['value']) {
    this.controls[2].value = value;
  }

  // Get the value of the fourth controller
  get 3(): T[3]['value'] {
    return this.controls[3].value;
  }

  set 3(value: T[3]['value']) {
    this.controls[3].value = value;
  }

  // Get the value of the fifth controller
  get 4(): T[4]['value'] {
    return this.controls[4].value;
  }

  set 4(value: T[4]['value']) {
    this.controls[4].value = value;
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
