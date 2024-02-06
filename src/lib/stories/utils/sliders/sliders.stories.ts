import { PrimeColor } from '$lib/utils/PrimeColors';
import { Slider, Sliders } from '$lib/utils/Slider';
import SliderCanvas from './CanvasWithSliders.svelte';

const sliders1 = new Sliders().add(new Slider(0.5, -2, 2, 0.5, PrimeColor.darkGreen));

const s1 = new Slider(0.5, -2, 2, 0.5, PrimeColor.darkGreen);
const s2 = new Slider(1, -2, 2, 0.5, PrimeColor.blue);
const s3 = new Slider(1.5, -2, 2, 0.5, PrimeColor.red);
const sliders2 = new Sliders().add(s1).add(s2).add(s3);

const sliders3 = new Sliders()
  .addSlider(0.5, -2, 2, 0.5)
  .addSlider(1, -2, 2, 0.5)
  .addSlider(1.5, -2, 2, 0.5);

export default {
  title: 'Tutorial/Sliders',
  component: SliderCanvas
};

export const OneSlider = {
  args: {
    title: 'One slider',
    sliders: sliders1
  }
};

export const MultiSlider = {
  args: {
    title: 'Three sliders',
    sliders: sliders2
  }
};

export const MultiSliderShorthand = {
  args: {
    title: 'Three sliders shorthand',
    sliders: sliders3
  }
};
