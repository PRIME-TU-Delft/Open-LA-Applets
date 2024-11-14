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

  toArray() {
    return [this.tl, this.tr, this.bl, this.br] as const;
  }

  clone() {
    return new Matrix2(this.tl, this.tr, this.bl, this.br);
  }
}
