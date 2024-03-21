import { Vector3 } from 'three';

/**
 * MathVector3 is a Vector3 that has the x, y, and z values swapped to be more consistent with the rest of the math
 */
export class MathVector3 extends Vector3 {
  constructor(x: number, y: number, z: number) {
    super(y, z, x);
  }

  clone(): this {
    return new MathVector3(this.z, this.x, this.y) as this;
  }
}
