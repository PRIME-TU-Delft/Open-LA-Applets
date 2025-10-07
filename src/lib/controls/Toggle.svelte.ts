import type { Controller } from './Controls';
import { PrimeColor } from '$lib/utils/PrimeColors';
import type { LocalizedString } from '$lib/utils';

/**
 * The Toggle class is used to create a toggle with a default value and a range of values.
 *
 * @param defaultValue The default value for the toggle
 * @param label The label for the toggle
 * @param color The color of the toggle default is blue
 */

export class Toggle implements Controller<boolean> {
  defaultValue = false;
  value = $state(false);
  color: string = PrimeColor.blue;
  width = 10;
  label: LocalizedString | string | undefined = undefined;
  type = 'toggle';
  isSwitch: boolean = false;
  switchRightSide: LocalizedString | string | undefined = undefined;

  constructor(
    defaultValue: boolean,
    label: LocalizedString | string | undefined = undefined,
    color: string = PrimeColor.blue,
    isSwitch: boolean = false,
    switchRightSide: LocalizedString | string | undefined = undefined
  ) {
    this.defaultValue = defaultValue;
    this.value = defaultValue;
    this.color = color;
    this.label = label;
    this.isSwitch = isSwitch;
    this.switchRightSide = switchRightSide;
  }

  static Default = new Toggle(false);
  static set(dft = false) {
    return new Toggle(dft);
  }

  reset() {
    this.value = this.defaultValue;

    return this;
  }
}
