import { Vector3 } from 'three';

/**
 * MathVector3 extends Vector3 with math coordinate system (x, y, z) where z is up.
 * Internally stores threlte coordinates (y, z, x) to work with threlte.
 * Use toThrelteVector3() to get threlte coordinates.
 */
export class MathVector3 extends Vector3 {
  mathX: number = 0;
  mathY: number = 0;
  mathZ: number = 0;

  constructor();
  constructor(x: number, y: number, z: number);
  constructor(v: Vector3);
  constructor(xOrV: number | Vector3 = 0, y: number = 0, z: number = 0) {
    // Check if trying to pass a MathVector3
    if (xOrV instanceof MathVector3) {
      throw new Error('Cannot create MathVector3 from another MathVector3. Use .clone() instead.');
    }

    // From threlte Vector3
    if (xOrV instanceof Vector3) {
      // Convert from threlte coordinates (this.x, this.y, this.z) = (y, z, x)
      super(xOrV.x, xOrV.y, xOrV.z);
      this.mathX = xOrV.z;
      this.mathY = xOrV.x;
      this.mathZ = xOrV.y;
    } else {
      // From math coordinates
      super(y, z, xOrV);
      this.mathX = xOrV;
      this.mathY = y;
      this.mathZ = z;
    }
  }

  /**
   * Convert to threlte's Vector3 coordinate system
   */
  toThrelteVector3(): Vector3 {
    return new Vector3(this.y, this.z, this.x);
  }

  toLatexString(): string {
    return (
      '\\begin{bmatrix} ' +
      this.mathX +
      ' \\\\ ' +
      this.mathY +
      ' \\\\ ' +
      this.mathZ +
      ' \\end{bmatrix}'
    );
  }

  clone(): this {
    return new MathVector3(this.mathX, this.mathY, this.mathZ) as this;
  }
}
