import type { PrimeColor } from './PrimeColors';

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

  /**
   * Creates a new instance of LegendItem
   * @param label Text representation of what does the color represent
   * @param color Color used for the concept in the applet
   */
  constructor(label: string, color: PrimeColor) {
    this.label = label;
    this.color = color;
  }
}
