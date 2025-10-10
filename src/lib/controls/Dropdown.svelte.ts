import type { Controller } from './Controls';
import { PrimeColor } from '$lib/utils/PrimeColors';

/**
 * The Dropdown class is used to create a dropdown with a default value and a range of values.
 *
 * @param defaultValue The default value for the dropdown (translation key)
 * @param values The range of values for the dropdown (translation keys)
 * @param title The title of the dropdown
 * @param color The color of the dropdown default is blue
 */

export class Dropdown implements Controller<string> {
  defaultValue: string;
  value: string;
  label = '';
  color: string = PrimeColor.blue;
  width = 30;
  values: readonly string[] = [];
  type = 'toggle';

  constructor(
    defaultValue: string,
    values: readonly string[],
    color: string = PrimeColor.blue,
    label = ''
  ) {
    if (values.length === 0) {
      throw new Error('Dropdown must have at least one label');
    }

    // Check if the default value is in the labels
    if (!values.includes(defaultValue) || defaultValue === undefined) {
      this.defaultValue = values[0];
    } else {
      this.defaultValue = defaultValue;
    }

    this.label = label;
    this.value = $state(this.defaultValue);
    this.values = values;
    this.color = color;
  }

  reset() {
    this.value = this.defaultValue;

    return this;
  }
}
