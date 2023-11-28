import { Sliders } from '$lib/utils/Slider';
import AnatomyCanvas from './AnatomyCanvas.svelte';

const sliders = new Sliders()
  .addSlider(0.5, -2, 2, 0.5)
  .addSlider(1, -2, 2, 0.5)
  .addSlider(1.5, -2, 2, 0.5);

export default {
  title: 'Tutorial/Anatomy of an applet',
  component: AnatomyCanvas
};

export const OneSlider = {
  args: {
    title: 'One slider',
    sliders: sliders
  }
};
