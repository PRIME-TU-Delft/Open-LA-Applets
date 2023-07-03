import { Vector3 } from "three";

export class MathVector3 extends Vector3 {
    constructor(x: number, y: number, z: number) {
        super(y, z, x);
    }

    clone(): this {
        return new MathVector3(this.z, this.x, this.y) as this;
    }
}