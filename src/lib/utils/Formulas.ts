import { PrimeColor } from './PrimeColors';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

/**
 * @description
 * This class is used to create a formula with a value.
 * The value is replaced in the formula with the color of the value.
 * The \\$ character is used to replace the value in the formula.
 * @example
 * const formula = new Formulas('The value is $', 10, PrimeColor.raspberry);
 * console.log(formula.stringFormula); // The value is 10
 * @example
 * const formula = new Formulas('The value is $', 10);
 * console.log(formula.stringFormula); // The value is 10
 * @example
 * const formula = new Formulas('The value is 10');
 * console.log(formula.stringFormula); // The value is 10
 */
export class Formula {
  id = crypto.randomUUID();

  illegalCharacters = /&/g;
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
      `\\textcolor{${color || PrimeColor.black}}{${value}}`
    );
  }

  raw() {
    return this.stringFormula;
  }

  addParam(index: number, param: number | string, color?: PrimeColor) {
    const value = param;

    if (index <= 0) {
      this.stringFormula = this.stringFormula.replaceAll(
        `\\$`,
        `\\textcolor{${color || PrimeColor.black}}{${value}}`
      );
    } else {
      this.stringFormula = this.stringFormula.replaceAll(
        `\\$${index}`,
        `\\textcolor{${color || PrimeColor.black}}{${value}}`
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

  clone(): Formula {
    return new Formula(this.stringFormula);
  }

  removeColor(): this {
    // Regex that filters out the color (color is a hex value)
    const regex = /\\textcolor{#[0-9a-fA-F]{6}}{(.+?)}/g;

    // Remove the color from the formula but keep its value
    this.stringFormula = this.stringFormula.replace(regex, '$1');

    return this;
  }

  stripInvalid(): this {
    this.stringFormula = this.stringFormula.replace(this.illegalCharacters, '');

    return this;
  }
}

export class Formulas extends Array<Formula> {
  private backup: Formula[] = []; // Backup of the formulas, incase we need to revert back to the original

  /**
   * Create new instance of Formulas.
   * @param formulas The formulas to be used.
   * @returns A new instance of Formulas.
   */
  constructor(...formulas: Formula[]) {
    super(...formulas);
    this.backup = [...formulas];
  }

  get(index: number): Formula {
    return this.backup[index];
  }

  align(): this {
    const fomulas = this.map((formula) => {
      return formula.stringFormula;
    }).join(' \\\\ ');

    const alignFormulas = `\\begin{aligned} ${fomulas} \\end{aligned}`;

    // Remove all entries from the array
    this.splice(0, this.length);

    this.push(new Formula(alignFormulas));

    return this;
  }
}
