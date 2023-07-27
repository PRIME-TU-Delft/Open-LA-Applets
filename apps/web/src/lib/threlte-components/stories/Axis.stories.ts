import type { Meta, StoryObj } from '@storybook/svelte';

import Axis from '../Axis.svelte';
import CanvasWrapper from './CanvasWrapper.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
  title: 'Threlte/Axis',
  component: Axis,
  decorators: [() => CanvasWrapper],
  tags: ['autodocs'],
  argTypes: {
    showNumbers: { type: 'boolean' },
    hideTicks: {
      type: 'boolean',
      description:
        'Hide the small ticks that loosly indecate where an object is positioned on the axis.'
    },
    axisLength: { type: 'number', description: 'Radius of each axis' },
    axisSpacing: {
      type: 'number',
      description: 'Default spacing between each tick and number on the axis.'
    },
    floor: {
      type: 'boolean',
      description:
        'A circular floor at z=0 to indecate what is up and down. Is useful for applets with only vectors or other small elements in them.'
    }
  },
  args: {
    hideTicks: false,
    axisSpacing: 1,
    axisLength: 10,
    floor: false
  }
} satisfies Meta<Axis>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Default: Story = {
  args: {
    floor: false
  }
};
