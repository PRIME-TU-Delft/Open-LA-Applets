import { PrimeColor } from './PrimeColors';

/**
 * @description
 * This class is used to create a formula with a value.
 * The value is replaced in the formula with the color of the value.
 * The \\$ character is used to replace the value in the formula.
 * @example
 * const formula = new Formulas('The value is $', 10, PrimeColor.red);
 * console.log(formula.stringFormula); // The value is 10
 * @example
 * const formula = new Formulas('The value is $', 10);
 * console.log(formula.stringFormula); // The value is 10
 * @example
 * const formula = new Formulas('The value is 10');
 * console.log(formula.stringFormula); // The value is 10
 */
export class Formulas {
  stringFormula: string;
  invalidFormula = false;

  /**
   * Create new instance of Formulas.
   * @param stringFormula The formula to be used.
   * @param param The value to be replaced in the formula.
   * @param color The color of the value.
   * @returns A new instance of Formulas.
   */
  constructor(stringFormula: string, param?: string | number, color?: PrimeColor) {
    if (!stringFormula) {
      this.stringFormula = '';
      this.invalidFormula = true;
    }

    if (param == undefined || param == null) {
      this.stringFormula = stringFormula;
      return;
    }

    const value = parseFloat('' + param).toFixed(2) || param;

    const input = stringFormula.replaceAll(
      '\\$',
      `\\htmlStyle{color: ${color || PrimeColor.black};}{${value}}`
    );

    this.stringFormula = input;
  }
}
