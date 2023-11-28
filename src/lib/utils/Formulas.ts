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
  autoIndex = 0;

  /**
   * Create new instance of Formulas.
   * @param stringFormula The formula to be used.
   * @param param The value(s) to be replaced in the formula.
   * @param color The color(s) of the value.
   * @returns A new instance of Formulas.
   */
  constructor(stringFormula: string, param?: number | string, color?: PrimeColor) {
    this.stringFormula = stringFormula || '';

    if (!stringFormula) {
      this.invalidFormula = true;
      return;
    }

    if (param == undefined || param == null) return;

    const value = parseFloat('' + param).toFixed(2) || param;

    this.stringFormula = this.stringFormula.replaceAll(
      '\\$',
      `\\htmlStyle{color: ${color || PrimeColor.black};}{${value}}`
    );
  }

  addParam(index: number, param: number | string, color?: PrimeColor) {
    const value = parseFloat('' + param).toFixed(2) || param;

    if (index <= 0) {
      this.stringFormula = this.stringFormula.replaceAll(
        `\\$`,
        `\\htmlStyle{color: ${color || PrimeColor.black};}{${value}}`
      );
    } else {
      this.stringFormula = this.stringFormula.replaceAll(
        `\\$${index}`,
        `\\htmlStyle{color: ${color || PrimeColor.black};}{${value}}`
      );
    }

    return this;
  }

  /**
   * Add a param to the formula indexed from 1.
   * @param param param to be replaced in the formula
   * @param color color of the param
   * @returns this
   */
  addAutoParam(param: number | string, color?: PrimeColor) {
    this.autoIndex += 1;

    const index = this.autoIndex;

    return this.addParam(index, param, color);
  }
}
