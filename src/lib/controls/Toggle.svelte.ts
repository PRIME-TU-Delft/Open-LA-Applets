import type { Controller } from './Controls';
import { PrimeColor } from '$lib/utils/PrimeColors';

/**
 * The Toggle class is used to create a toggle with a default value and a range of values.
 *
 * @param defaultValue The default value for the toggle
 * @param color The color of the toggle default is blue
 */

export class Toggle implements Controller<boolean> {
  defaultValue = false;
  value = $state(false);
  color: string = PrimeColor.blue;
  width = 10;
  label: string | undefined = undefined;
  type = 'toggle';

  constructor(
    defaultValue: boolean,
    label: string | undefined = undefined,
    color: string = PrimeColor.blue
  ) {
    this.defaultValue = defaultValue;
    this.value = defaultValue;
    this.color = color;
    this.label = label;
  }

  static Default = new Toggle(false);
  static set(dft = false) {
    return new Toggle(dft);
  }

  reset() {
    this.value = this.defaultValue;

    return this;
  }

  toURL() {
    return `${this.value}`;
  }

  fromURL(s: string) {
    this.value = Boolean(s);

    return this;
  }
}
