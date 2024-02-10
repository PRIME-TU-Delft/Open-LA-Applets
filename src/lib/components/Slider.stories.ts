import type { Meta, StoryObj } from '@storybook/svelte';

import Slider from './Slider.svelte';
import { Controls } from '$lib/utils/Controls';

const sliders = Controls.addSlider(0);

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    isExpanded: { type: 'boolean' },
    isPlaying: { type: 'boolean' },
    playSpeed: { type: 'number' }
  }
} satisfies Meta<Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Default: Story = {
  args: {
    slider: sliders.controls[0],
    playSpeed: 1000 / 60
  }
};
