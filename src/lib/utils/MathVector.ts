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

  clone(): this {
    return new MathVector3(this.mathX, this.mathY, this.mathZ) as this;
  }

  add(v: Vector3): this {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot add non-MathVector3 to MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.add(v);
  }

  sub(v: Vector3): this {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot subtract non-MathVector3 from MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.sub(v);
  }

  multiply(v: Vector3): this {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot multiply MathVector3 by non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.multiply(v);
  }

  divide(v: Vector3): this {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot divide MathVector3 by non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.divide(v);
  }

  dot(v: Vector3): number {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot compute dot product with non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.dot(v);
  }

  cross(v: Vector3): this {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot compute cross product with non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.cross(v);
  }

  distanceTo(v: Vector3): number {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot compute distance to non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.distanceTo(v);
  }

  distanceToSquared(v: Vector3): number {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot compute squared distance to non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.distanceToSquared(v);
  }

  lerp(v: Vector3, t: number): this {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot lerp with non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.lerp(v, t);
  }

  min(v: Vector3): this {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot compute min with non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.min(v);
  }

  max(v: Vector3): this {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot compute max with non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.max(v);
  }

  clamp(min: Vector3, max: Vector3): this {
    if (!(min instanceof MathVector3) || !(max instanceof MathVector3)) {
      throw new Error(
        'Cannot clamp with non-MathVector3 bounds. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.clamp(min, max);
  }

  copy(v: Vector3): this {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot copy from non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.copy(v);
  }

  equals(v: Vector3): boolean {
    if (!(v instanceof MathVector3)) {
      throw new Error(
        'Cannot compare MathVector3 with non-MathVector3. Convert to MathVector3 first or use .toThrelteVector3() if you need to work with threlte Vector3.'
      );
    }
    return super.equals(v);
  }
}
