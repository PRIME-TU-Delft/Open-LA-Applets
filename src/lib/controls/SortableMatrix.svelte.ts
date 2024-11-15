import type { Controller } from './Controls';
import type { Matrix } from './Matrix.svelte';

export class SortableMatrix implements Controller<number[]> {
  defaultValue: number[] = [];
  value: number[] = $state([]);

  matrices: Matrix[] = $state([]);

  width = 100;
  type = 'Matrix';

  disabled = $state(false);

  constructor(matrices: Matrix[]) {
    this.matrices = matrices;

    this.defaultValue = matrices.map((_, i) => i);
    this.value = matrices.map((_, i) => i);
  }

  static Default = [];

  toggleAvailability() {
    this.disabled = !this.disabled;
  }

  reset() {
    this.matrices.map((v) => v.reset());
    this.value = this.matrices.map((_, i) => i);

    return this;
  }
}
