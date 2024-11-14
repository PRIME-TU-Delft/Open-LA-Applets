import { PrimeColor } from '$lib/utils/PrimeColors';
import type { Controller } from './Controls';

export class Button implements Controller<void> {
  // Used to make the button a subclass of Controller
  defaultValue: undefined = undefined;
  value = $state(undefined);

  color: string = PrimeColor.blue;
  width = 10;
  label: string | undefined = undefined;
  type = 'toggle';
  action = () => {};

  constructor(
    label: string | undefined = undefined,
    color: string = PrimeColor.blue,
    action?: () => void
  ) {
    this.color = color;
    this.label = label;
    this.action = action || (() => {});
  }

  static Default = new Button();
  static set() {
    return new Button();
  }

  reset() {
    return this;
  }
}
