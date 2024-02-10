import { Formula } from '$lib/utils/Formulas';
import { Controls } from '$lib/utils/Controls';
import AnatomyCanvas from './AnatomyCanvas.svelte';

const sliders = Controls.addSlider(0.5, -2, 2, 0.5)
  .addSlider(1, -2, 2, 0.5)
  .addSlider(1.5, -2, 2, 0.5);

export default {
  title: 'Tutorial/Anatomy of an applet',
  component: AnatomyCanvas
};

export const SimpleCanvas = {
  args: {
    title: 'Trivial example with red cube'
  }
};

export const FullHeaderCanvas = {
  args: {
    title: 'Full header example',
    isIframe: true,
    formulas: [new Formula('3x = y')],
    showFormulasDefault: true,
    sliders: sliders
  }
};
