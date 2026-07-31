import { PrimeColor } from './PrimeColors';

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
  latex: string;
  invalidFormula = false;
  autoIndex = 0;
  textColor: PrimeColor | undefined = undefined;

  /**
   * Create new instance of Formulas.
   * @param latex The formula to be used.
   * @param param The value(s) to be replaced in the formula.
   * @param color The color(s) of the value.
   * @param textColor Optional color applied to the entire formula.
   * @returns A new instance of Formulas.
   */
  constructor(latex: string, param?: number | string, color?: PrimeColor, textColor?: PrimeColor) {
    this.latex = latex || '';

    if (!latex) {
      this.invalidFormula = true;
      return;
    }

    if (param != undefined && param != null) {
      const value = parseFloat('' + param).toFixed(2) || param;

      this.latex = this.latex.replaceAll(
        '\\$',
        `\\textcolor{${color || PrimeColor.black}}{${value}}`
      );
    }

    if (textColor != undefined) {
      this.textColor = textColor;
      // Take care of possible & for alignment
      let new_latex = ``;
      const parts = this.latex.split('&');
      parts.forEach((part, index, array) => {
        new_latex += `\\textcolor{${textColor}}{${part}}`;
        if (index != array.length - 1) {
          new_latex += `&`;
        }
      });
      this.latex = new_latex;
    }
  }

  raw() {
    return this.latex;
  }

  addParam(index: number, param: number | string, color?: PrimeColor) {
    const value = param;
    const resolvedColor = color ?? this.textColor ?? PrimeColor.black;

    if (index <= 0) {
      this.latex = this.latex.replaceAll(`\\$`, `\\textcolor{${resolvedColor}}{${value}}`);
    } else {
      this.latex = this.latex.replaceAll(`\\$${index}`, `\\textcolor{${resolvedColor}}{${value}}`);
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
    return new Formula(this.latex);
  }

  removeColor(): this {
    // Regex that filters out the color (color is a hex value)
    const regex = /\\textcolor{#[0-9a-fA-F]{6}}{(.+?)}/g;

    // Remove the color from the formula but keep its value
    this.latex = this.latex.replace(regex, '$1');

    return this;
  }

  stripInvalid(): this {
    this.latex = this.latex.replace(this.illegalCharacters, '');

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
      return formula.latex;
    }).join(' \\\\ ');

    const alignFormulas = `\\begin{aligned} ${fomulas} \\end{aligned}`;

    // Remove all entries from the array
    this.splice(0, this.length);

    this.push(new Formula(alignFormulas));

    return this;
  }
}
