import { Vector3 } from 'three';

/**
 * MathVector3 is a Vector3 that has the x, y, and z values swapped to be more consistent with the rest of the math
 */
export class MathVector3 extends Vector3 {

  mathX: number = 0;
  mathY: number = 0;
  mathZ: number = 0;

  constructor(x: number, y: number, z: number) {
    super(y, z, x);

    this.mathX = x;
    this.mathY = y;
    this.mathZ = z;
  }

  clone(): this {
    return new MathVector3(this.z, this.x, this.y) as this;
  }
}
