import { PrimeColor, type ColorString } from '$lib/utils/PrimeColors';
import { Slider } from './Slider.svelte';
import { Toggle } from './Toggle.svelte';
import { SlideShow, type SlideShowSteps } from './SlideShow.svelte';
import { Dropdown } from './Dropdown.svelte';

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

export class Controls<State, T extends readonly Controller<number | boolean | string | State>[]> {
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

  isAllowedToAddControl(control: Controller<number | boolean | string>) {
    if (this._width + control.width > this.MAX_WIDTH) {
      throw new Error(
        `Controls width exceeded: ${this._width + control.width} > ${this.MAX_WIDTH}`
      );
    }

    if (this.controls.length >= 5) throw new Error('Controls length exceeded');
  }

  /**
   * Adds a new slider to the sliders array
   * @param dft - default value for the slider default is 0
   * @param from - from value, default is -1
   * @param to - to value, default is 1
   * @param step - step size, default is 0.1
   * @param color - color for the slider default is raspberry
   * @param options.loop - If the slider bounces or loops during autoplay
   * @param options.label - label for the slider
   * @param options.valueFn - function to format the value
   * @returns this
   */
  addSlider(
    dft: number,
    from: number,
    to: number,
    step: number,
    color?: ColorString,
    options?: {
      label?: string;
      loop?: boolean;
      valueFn?: (v: number) => string;
      onRelease?: (v: number) => void;
    }
  ) {
    const colors = PrimeColor.asArray();
    const sliderColor = color || colors[this.length % colors.length];

    const newSlider = new Slider(
      dft,
      from,
      to,
      step,
      sliderColor,
      options?.label,
      options?.loop,
      options?.valueFn,
      options?.onRelease
    );

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
   * @param options.loop - If the slider bounces or loops during autoplay
   * @param options.label - label for the slider
   * @param options.valueFn - function to format the value
   * @returns this
   */
  static addSlider(
    dft: number,
    from: number,
    to: number,
    step: number,
    color: ColorString = PrimeColor.getColor(0),
    options?: {
      label?: string;
      loop?: boolean;
      valueFn?: (v: number) => string;
      onRelease?: (v: number) => void;
    }
  ) {
    const newSlider = new Slider(
      dft,
      from,
      to,
      step,
      color,
      options?.label,
      options?.loop,
      options?.valueFn,
      options?.onRelease
    );
    return new Controls([newSlider] as const, newSlider.width);
  }

  /**
   * Add a new toggle to the controls array
   * @param dft - default value for the toggle default is false
   * @param title - title for the toggle
   * @param color - color for the toggle default is raspberry
   * @returns this
   */
  addToggle(
    dft: boolean,
    title?: string,
    color: ColorString = PrimeColor.getColor(0),
    options?: {
      isSwitch?: boolean;
      switchRightSide?: string;
    }
  ) {
    const newToggle = new Toggle(dft, title, color, options?.isSwitch, options?.switchRightSide);
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
  static addToggle(
    dft: boolean,
    title?: string,
    color: ColorString = PrimeColor.getColor(0),
    options?: {
      isSwitch?: boolean;
      switchRightSide?: string;
    }
  ) {
    const newToggle = new Toggle(dft, title, color, options?.isSwitch, options?.switchRightSide);
    return new Controls([newToggle] as const, newToggle.width);
  }

  /**
   * Add a new Dropdown to the controls array
   * @param labels - labels for the dropdown
   * @param dft - default value for the dropdown
   * @param color - color for the dropdown default is raspberry
   */
  addDropdown(dft: string, values: string[], color?: ColorString) {
    const newDropdown = new Dropdown(dft, values, color);
    this.isAllowedToAddControl(newDropdown);
    return new Controls([...this.controls, newDropdown] as const, this._width + newDropdown.width);
  }

  /**
   * Static method to create set Controls<T> to a new dropdown
   * @param labels - labels for the dropdown
   * @param dft - default value for the dropdown
   * @param color - color for the dropdown default is raspberry
   * @returns
   */
  static addDropdown(dft: string, values: string[], color?: ColorString) {
    const newDropdown = new Dropdown(dft, values, color);
    return new Controls([newDropdown] as const, newDropdown.width);
  }

  /**
   * Static method to create set Controls<T> to a new animation
   * @param dft - default value for the animation
   * @param label - label for the animation
   * @returns
   */
  static addSlideShow<State>(dft: State, steps: SlideShowSteps<State>, label?: string) {
    const newSlideShow = new SlideShow(dft, steps, label);
    return new Controls([newSlideShow] as const, newSlideShow.width);
  }

  // Reset all sliders to their default values
  reset() {
    this._controls.map(async (c) => c.reset());

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
