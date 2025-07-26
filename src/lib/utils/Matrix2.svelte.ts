import { Vector2 } from 'three';

export default class Matrix2 extends Array<number> {
  tl: number = $state(0);
  tr: number = $state(0);
  bl: number = $state(0);
  br: number = $state(0);

  constructor(tl = 0, tr = 0, bl = 0, br = 0) {
    super(tl, tr, bl, br);

    this.tl = tl;
    this.tr = tr;
    this.bl = bl;
    this.br = br;
  }

  static get I() {
    return new Matrix2(1, 0, 0, 1);
  }

  fromIndex(index: number, value: number) {
    switch (index) {
      case 0:
        this.tl = value;
        break;
      case 1:
        this.tr = value;
        break;
      case 2:
        this.bl = value;
        break;
      case 3:
        this.br = value;
        break;
    }
  }

  fromArray(array: number[]) {
    this.tl = array[0];
    this.tr = array[1];
    this.bl = array[2];
    this.br = array[3];
  }

  multiply(matrix: Matrix2) {
    const b = matrix;

    const tl = this.tl * b.tl + this.tr * b.bl;
    const tr = this.tl * b.tr + this.tr * b.br;
    const bl = this.bl * b.tl + this.br * b.bl;
    const br = this.bl * b.tr + this.br * b.br;

    return new Matrix2(tl, tr, bl, br);
  }

  multiplyVector(vector: Vector2) {
    const x = vector.x;
    const y = vector.y;

    const tl = this.tl * x + this.tr * y;
    const tr = this.bl * x + this.br * y;

    return new Vector2(tl, tr);
  }

  add(matrix: Matrix2) {
    const b = matrix;

    const tl = this.tl + b.tl;
    const tr = this.tr + b.tr;
    const bl = this.bl + b.bl;
    const br = this.br + b.br;

    return new Matrix2(tl, tr, bl, br);
  }

  subtract(matrix: Matrix2) {
    const b = matrix;

    const tl = this.tl - b.tl;
    const tr = this.tr - b.tr;
    const bl = this.bl - b.bl;
    const br = this.br - b.br;

    return new Matrix2(tl, tr, bl, br);
  }

  /**
   * Calculates eigen values of the matrix
   * @returns Array of (real or imaignary) eigen values
   */
  getEigenValues(): number[] | { real: number; imaginary: number }[] {
    const a = this.tl;
    const b = this.tr;
    const c = this.bl;
    const d = this.br;

    const trace = a + d;
    const determinant = a * d - b * c;
    const discriminant = trace * trace - 4 * determinant;

    if (discriminant < 0) {
      // Complex eigenvalues
      const real = trace / 2;
      const imaginary = Math.sqrt(-discriminant) / 2;
      return [
        { real, imaginary },
        { real, imaginary: -imaginary }
      ];
    } else {
      const sqrtDiscriminant = Math.sqrt(discriminant);
      return [(trace + sqrtDiscriminant) / 2, (trace - sqrtDiscriminant) / 2];
    }
  }

  /**
   * Calculates the eigenvectors of the matrix.
   * @returns An array of `Vector2` eigenvectors or empty array if the eigenvalues are complex
   */
  getEigenVectors(): Vector2[] {
    const eigenValues = this.getEigenValues();

    if (eigenValues.length > 0 && typeof eigenValues[0] === 'object') {
      // Complex eigenvalues
      return [];
    }

    const realEigenvalues = eigenValues as number[];

    if (realEigenvalues[0] === realEigenvalues[1]) {
      // Repeated eigenvalues
      const lambda = realEigenvalues[0];
      const m = new Matrix2(this.tl - lambda, this.tr, this.bl, this.br - lambda);
      if (m.tl === 0 && m.tr === 0 && m.bl === 0 && m.br === 0) {
        return [new Vector2(1, 0), new Vector2(0, 1)];
      }
      const v = new Vector2(-m.tr, m.tl).normalize();
      return [v];
    }

    const eigenvectors: Vector2[] = [];
    for (const lambda of realEigenvalues) {
      const m = new Matrix2(this.tl - lambda, this.tr, this.bl, this.br - lambda);

      let eigenvector: Vector2;
      if (m.tl !== 0 || m.tr !== 0) {
        eigenvector = new Vector2(-m.tr, m.tl);
      } else {
        eigenvector = new Vector2(-m.br, m.bl);
      }
      eigenvectors.push(eigenvector.normalize());
    }

    return eigenvectors;
  }

  toArray() {
    return [this.tl, this.tr, this.bl, this.br] as const;
  }

  clone() {
    return new Matrix2(this.tl, this.tr, this.bl, this.br);
  }
}
