import { Controls } from '$lib/utils/Controls';
import { PrimeColor } from '$lib/utils/PrimeColors';
import SliderCanvas from './CanvasWithSliders.svelte';

const controls1 = Controls.addSlider(0.5, -2, 2, 0.5, PrimeColor.darkGreen);

const sliders2 = Controls.addSlider(0.5, -2, 2, 0.5)
  .addSlider(1, -2, 2, 0.5)
  .addSlider(1.5, -2, 2, 0.5);

export default {
  title: 'Tutorial/Sliders',
  component: SliderCanvas
};

export const OneSlider = {
  args: {
    title: 'One slider',
    sliders: controls1
  }
};

export const MultiSlider = {
  args: {
    title: 'Three sliders',
    sliders: sliders2
  }
};
