import p5 from 'p5';

export enum GridType {
  simpleGrid = 'SIMPLE_GRID',
  squareGrid = 'SQUARE_GRID',
  none = 'NONE'
}

export class Grid {
  static setText(p5: p5, num: number, x: number, y: number, scale = 1) {
    p5.push();
    p5.stroke(255);
    p5.translate(x, -y);
    p5.scale(1 / scale, -1 / scale);

    if (num % 1 == 0) {
      p5.fill(0);
      p5.text(num, 0, 0);
    } else if (scale > 1) {
      p5.fill(0, 100);
      p5.text(num, 0, 0);
    }

    p5.pop();
  }

  static drawSimpleGrid(p5: p5, size: number, scale = 1, stepSize = 50) {
    let indecatorSteps = Math.floor(size / stepSize);
    if (indecatorSteps % 2 === 1) indecatorSteps++;

    p5.line(-size * 2, 0, size * 2, 0);
    p5.line(0, -size * 2, 0, size * 2);

    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.line(stepSize * i, -5, stepSize * i, 5);
      Grid.setText(p5, (i * stepSize) / 100, stepSize * i + 5, 20, scale);
    }
    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.line(-5, stepSize * i, 5, stepSize * i);

      Grid.setText(p5, (-i * stepSize) / 100, 5, stepSize * i - 5, scale);
    }

    return indecatorSteps;
  }

  static drawSquareGrid(p5: p5, size: number, scale = 1, stepSize: number = 50) {
    const indecatorSteps = Grid.drawSimpleGrid(p5, size, scale, stepSize);

    p5.push();
    p5.strokeWeight(0.5);

    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.stroke(150, ((indecatorSteps - Math.abs(i)) / indecatorSteps) * 150);

      if (i % 10 === 0) p5.strokeWeight(2);
      else if (i % 5 === 0) p5.strokeWeight(1);
      else p5.strokeWeight(0.5);

      p5.line(-indecatorSteps * stepSize, stepSize * i, indecatorSteps * stepSize, stepSize * i);
    }
    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.stroke(150, ((indecatorSteps - Math.abs(i)) / indecatorSteps) * 150);

      if (i % 10 === 0) p5.strokeWeight(2);
      else if (i % 5 === 0) p5.strokeWeight(1);
      else p5.strokeWeight(0.5);

      p5.line(stepSize * i, -indecatorSteps * stepSize, stepSize * i, indecatorSteps * stepSize);
    }

    p5.pop();
  }
}
