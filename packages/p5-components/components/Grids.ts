import p5 from 'p5';

export enum GridType {
  simpleGrid = 'SIMPLE_GRID',
  squareGrid = 'SQUARE_GRID',
  none = 'NONE'
}

export class Grid {
  static drawSimpleGrid(p5: p5, size: number, stepSize = 100) {
    let indecatorSteps = Math.floor(size / stepSize);
    if (indecatorSteps % 2 === 1) indecatorSteps++;

    p5.line(-size * 2, 0, size * 2, 0);
    p5.line(0, -size * 2, 0, size * 2);

    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.line(stepSize * i, -5, stepSize * i, 5);
    }
    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.line(-5, stepSize * i, 5, stepSize * i);
    }

    return indecatorSteps;
  }

  static drawSquareGrid(p5: p5, size: number, stepSize: number = 100) {
    const indecatorSteps = Grid.drawSimpleGrid(p5, size, stepSize);

    p5.strokeWeight(0.5);

    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.line(-indecatorSteps * stepSize, stepSize * i, indecatorSteps * stepSize, stepSize * i);
    }
    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.line(stepSize * i, -indecatorSteps * stepSize, stepSize * i, indecatorSteps * stepSize);
    }
    p5.pop();
  }
}
