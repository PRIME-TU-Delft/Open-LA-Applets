import { Formula } from '$lib/utils/Formulas';
import { PrimeColor } from '$lib/utils/PrimeColors';
import { Controls } from '$lib/utils/Controls';
import FormulaCanvas from './FormulaCanvas.svelte';

const sliders = Controls.addSlider(1, -2, 3, 0.5).addSlider(2, -2, 3, 0.5).addSlider(3, -2, 3, 0.5);

const f1 = new Formula('Area = 1 * 2 * 3 = \\$', 6, PrimeColor.red);
const f2 = new Formula('Surface = 2 * (2 + 6 + 3) = \\$', 22, PrimeColor.yellow);

const f3 = new Formula('Area = \\$1 * \\$3 * \\$2 = 6')
  .addParam(1, 1, PrimeColor.red)
  .addParam(3, 2, PrimeColor.yellow)
  .addParam(2, 3, PrimeColor.darkGreen);

const f4 = new Formula('Surface = \\$1 * (\\$1 + \\$2 + \\$3) = 22')
  .addAutoParam(2, PrimeColor.red)
  .addAutoParam(6, PrimeColor.yellow)
  .addAutoParam(3, PrimeColor.darkGreen);

export default {
  title: 'Tutorial/Formulas',
  component: FormulaCanvas
};

export const SimpleFormula = {
  args: {
    title: 'Trivial example with red rectangle',
    formulas: [f1, f2]
  }
};

export const MulticolorFormula = {
  args: {
    title: 'Multi-color example with red rectangle',
    formulas: [f3, f4]
  }
};

export const InteractiveFormula = {
  args: {
    title: 'Interactive example with red rectangle',
    sliders: sliders
  }
};
