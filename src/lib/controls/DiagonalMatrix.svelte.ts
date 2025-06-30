import { PrimeColor } from '$lib/utils/PrimeColors';
import Matrix2 from '$lib/utils/Matrix2.svelte';
import { Matrix } from './Matrix.svelte';

export class DiagonalMatrix extends Matrix {
  type = 'DiagonalMatrix';

  constructor(defaultValue: Matrix2, label: string = '', color: string = PrimeColor.black) {
    if (defaultValue.tr !== defaultValue.bl) {
      throw new Error(
        'DiagonalMatrix requires a matrix with equal top right and bottom left elements.'
      );
    }

    super(defaultValue, label, color);
  }

  static Default = new Matrix2(0, 0, 0, 0);

  static set(tl = 0, tr = 0, bl = 0, br = 0) {
    if (tr !== bl) {
      throw new Error(
        'DiagonalMatrix requires a matrix with equal top right and bottom left elements.'
      );
    }

    return new Matrix2(tl, tr, bl, br);
  }
}
