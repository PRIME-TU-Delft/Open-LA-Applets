import Matrix2 from '$lib/utils/Matrix2.svelte';
import { PrimeColor } from '$lib/utils/PrimeColors';
import type { Controller } from './Controls';

export class Matrix implements Controller<Matrix2> {
  defaultValue = new Matrix2(0, 0, 0, 0);
  value = $state(new Matrix2(0, 0, 0, 0));
  color = $state(PrimeColor.black);
  width = 30;
  type = 'Matrix';
  label = '';

  disabled = $state(false);

  constructor(defaultValue: Matrix2, label: string = '', color: string = PrimeColor.black) {
    this.defaultValue = defaultValue.clone();
    this.value = defaultValue;
    this.color = color;

    this.label = label;
  }

  static Default = new Matrix2(0, 0, 0, 0);

  static set(tl = 0, tr = 0, bl = 0, br = 0) {
    return new Matrix2(tl, tr, bl, br);
  }

  toggleAvailability() {
    this.disabled = !this.disabled;
  }

  reset() {
    this.value.bl = this.defaultValue.bl;
    this.value.br = this.defaultValue.br;
    this.value.tl = this.defaultValue.tl;
    this.value.tr = this.defaultValue.tr;
    this.disabled = false;

    return this;
  }
}
