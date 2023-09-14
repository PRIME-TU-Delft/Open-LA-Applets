import type p5 from 'p5';
import type { Vector2 } from 'three';

export enum GridType {
  simpleGrid = 'SIMPLE_GRID',
  squareGrid = 'SQUARE_GRID',
  triangularGrid = 'TRIANGULAR_GRID',
  none = 'NONE'
}

/**
 * A class representing a grid.
 */
export class Grid {
  /**
   * Sets the text for the grid.
   * @param p5 - The p5 instance.
   * @param num - The number to be displayed.
   * @param x - The x-coordinate of the text.
   * @param y - The y-coordinate of the text.
   * @param scale - The scale of the text.
   */
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

  /**
   * Draws a simple grid.
   * @param p5 - The p5 instance.
   * @param size - The size of the grid.
   * @param scale - The scale of the grid.
   * @param stepSize - The step size of the grid.
   * @returns The number of indicator steps.
   */
  static drawSimpleGrid(p5: p5, size: number, scale = 1, stepSize: number = 50) {
    let indecatorSteps = Math.floor(size / stepSize);
    if (indecatorSteps % 2 === 1) indecatorSteps++;

    p5.line(-size * 2, 0, size * 2, 0);
    p5.line(0, -size * 2, 0, size * 2);

    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.line(stepSize * i, -5, stepSize * i, 5);
      this.setText(p5, (i * stepSize) / 100, stepSize * i + 5, 20, scale);
    }
    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.line(-5, stepSize * i, 5, stepSize * i);

      this.setText(p5, (-i * stepSize) / 100, 5, stepSize * i - 5, scale);
    }

    return indecatorSteps;
  }

  /**
   * Draws a grid.
   * @param p5 - The p5 instance.
   * @param size - The size of the grid.
   * @param gridType - The type of the grid.
   * @param scale - The scale of the grid.
   * @param stepSize - The step size of the grid.
   */
  static drawGrid(p5: p5, size: number, gridType: GridType = GridType.simpleGrid, scale = 1, stepSize = 50) {
    switch (gridType) {
      case GridType.squareGrid:
        SquareGrid.draw(p5, size, scale);
        break;
      case GridType.triangularGrid:
        TriangularGrid.draw(p5, size, scale);
        break;
      case GridType.none:
        break;
      default:
        this.drawSimpleGrid(p5, size, scale);
    }
  }

  /**
   * Snaps the position to the grid.
   * @param position - The position to be snapped.
   * @param gridType - The type of the grid.
   * @returns The snapped position.
   */
  static snapFunction(position: Vector2, gridType: GridType = GridType.simpleGrid) {
    const pos = position.clone()

    switch (gridType) {
      case GridType.triangularGrid:
        return TriangularGrid.snapFunction(pos);
      case GridType.none:
        return pos;
      default:
        pos.x = Math.round(pos.x / 0.5) * 0.5
        pos.y = Math.round(pos.y / 0.5) * 0.5
        return pos
    }
  }
}

export class SquareGrid extends Grid {
  static draw(p5: p5, size: number, scale = 1, stepSize: number = 50) {
    const indecatorSteps = super.drawSimpleGrid(p5, size, scale, stepSize);

    p5.push();
    p5.strokeWeight(0.5);

    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.stroke(150, ((indecatorSteps - Math.abs(i)) / indecatorSteps) * 150);

      if (i % 10 === 0) p5.strokeWeight(2);
      else if (i % 5 === 0) p5.strokeWeight(1);
      else p5.strokeWeight(0.5);

      p5.line(-indecatorSteps * stepSize, stepSize * i, indecatorSteps * stepSize, stepSize * i);
      p5.line(stepSize * i, -indecatorSteps * stepSize, stepSize * i, indecatorSteps * stepSize);
    }

    p5.pop();
  }
}

export class TriangularGrid extends Grid {
  static draw(p5: p5, size: number, scale = 1, stepSize: number = 100) {
    const indecatorSteps = super.drawSimpleGrid(p5, size, scale, stepSize);

    p5.push();
    p5.strokeWeight(0.5);
    const turnRadius = Math.PI / 6;

    // Horizontal lines with 60° rotation
    for (let i = -indecatorSteps; i < indecatorSteps + 1; i++) {
      p5.stroke(150, ((indecatorSteps - Math.abs(i)) / indecatorSteps) * 150);


      if (i % 5 === 0) p5.strokeWeight(1);
      else p5.strokeWeight(0.5);

      p5.line(-indecatorSteps * stepSize, stepSize * i, indecatorSteps * stepSize, stepSize * i);
      p5.push();
      p5.rotate(turnRadius);
      p5.line(stepSize * i, -indecatorSteps * stepSize, stepSize * i, indecatorSteps * stepSize);
      p5.pop();

      p5.push();
      p5.rotate(-turnRadius);
      p5.line(stepSize * i, -indecatorSteps * stepSize, stepSize * i, indecatorSteps * stepSize);
      p5.pop();
    }

    p5.pop();
  }

  /**
   * A snap function for the triangular (Hexagonal) grid.
   * @param position - The position to be snapped.
   * @returns The snapped position.
   */
  static snapFunction(position: Vector2) {
    // Snap round to neareast Math.sqrt(4 / 3)
    const snapRound = Math.sqrt(4 / 3);

    position.y = Math.round(position.y);

    // Add delta to x to make sure the hexagons are aligned
    const delta = position.y % 2 === 0 ? 0 : snapRound / 2;

    position.x = Math.round((position.x + delta) / snapRound) * snapRound - delta;

    return position;
  }
}