import type { PrimeColor } from './PrimeColors';

export enum FillType {
  Full,
  Dashed,
  Border
}

export enum Shape {
  Circle,
  Square,
  Triangle
}

/**
 * @description
 * This class is used to create a legend item.
 * @example
 * const legendItems = [
 *  new LegendItem('Left rectangle', PrimeColor.orange),
 *  new LegendItem('Right rectangle', PrimeColor.blue),
 *  new LegendItem('Trapezoid', PrimeColor.darkGreen)
 * ];
 */
export class LegendItem {
  id = crypto.randomUUID();

  label: string;
  color: PrimeColor;
  strokeColor: PrimeColor | undefined;
  strokeWidth: number = 3;
  opacity: number = 1;
  shape: Shape;
  fillType: FillType = FillType.Full;

  /**
   * Creates a new instance of LegendItem
   * @param label Text representation of what does the color/shape represent
   * @param color Color used for the concept in the applet
   * @param shape Shape used for the concept in the applet
   * @param fill Type of fill for the circle in the legend
   * @param strokeColor Optional stroke color for the shape
   * @param strokeWidth Optional stroke width for the shape (default: 3)
   * @param opacity Optional opacity for the fill (default: 1)
   */
  constructor(
    label: string,
    color: PrimeColor,
    shape?: Shape | string,
    fill?: FillType,
    strokeColor?: PrimeColor,
    strokeWidth?: number,
    opacity?: number
  ) {
    this.label = label;
    this.color = color;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth ?? 3;
    this.opacity = opacity ?? 1;

    if (typeof shape == 'string') {
      shape = LegendItem.getShape(shape);
    }

    this.shape = shape || Shape.Circle;
    this.fillType = fill || this.fillType;
  }

  /**
   * Get shape enum from string
   * @param shape Shape in string form
   * @returns Shape in Enum form
   */
  static getShape(shape: string) {
    switch (shape) {
      case 'square':
        return Shape.Square;
      case 'triangle':
        return Shape.Triangle;
      default:
        return Shape.Circle;
    }
  }
}
