import type { Controller } from './Controls';
import { PrimeColor } from '$lib/utils/PrimeColors';
import type { Snippet } from 'svelte';

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
  value = $state(0);
  min = -1;
  max = 1;
  stepSize = 0.1;
  color: string = PrimeColor.blue;
  width = 30;
  type = 'sliders';
  label = '';
  loop = false;
  valueFn: (v: number) => string;
  labelFormat?: (v: number) => ReturnType<Snippet>;
  onRelease: (v: number) => void;

  constructor(
    defaultValue: number,
    min = -1,
    max = 1,
    step = 0.1,
    color: string = PrimeColor.blue,
    label: string = '',
    loop: boolean = false,
    valueFn: (v: number) => string = (v) => v.toString(),
    valueFormat: ((v: number) => ReturnType<Snippet>) | undefined = undefined,
    onRelease: (v: number) => void = () => {}
  ) {
    this.defaultValue = defaultValue;
    this.min = min;
    this.max = max;
    this.stepSize = step;
    this.value = defaultValue;
    this.color = color;
    this.label = label;
    this.loop = loop;
    this.valueFn = valueFn;
    this.onRelease = onRelease;
    this.labelFormat = valueFormat;
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

  updateBy(step: number) {
    this.value = this.value + step;
  }

  reset(ms: number = 750, timeSteps: number = 20) {
    // this.value = this.defaultValue;
    const delta = this.defaultValue - this.value;

    // Return early if the delta is near zero
    if (Math.abs(delta) < 0.0001) {
      this.value = this.defaultValue;
      return this;
    }

    // Animate the slider to the default value in 750ms in timeSteps steps
    const step = delta / timeSteps;

    let i = 0;

    const interval = setInterval(() => {
      this.updateBy(step);

      if (i++ === timeSteps - 1) {
        clearInterval(interval);
        this.value = this.defaultValue;
      }
    }, ms / timeSteps);

    return this;
  }
}
