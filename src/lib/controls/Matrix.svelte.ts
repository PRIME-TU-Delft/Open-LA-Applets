import type { Controller } from './Controls';
import Matrix2 from '$lib/utils/Matrix2.svelte';

export class Matrix implements Controller<Matrix2> {
  defaultValue = new Matrix2(0, 0, 0, 0);
  value = $state(new Matrix2(0, 0, 0, 0));
  width = 30;
  type = 'Matrix';
  label = '';

  disabled = $state(false);

  constructor(defaultValue: Matrix2, label: string = '') {
    this.defaultValue = defaultValue.clone();
    this.value = defaultValue;

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
    this.value = this.defaultValue.clone();

    return this;
  }
}
