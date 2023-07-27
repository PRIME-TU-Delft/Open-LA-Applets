import { Vector3 } from 'three';
import Label from '../Label.svelte';
import CanvasWithAxis from './CanvasWithAxis.svelte';
import { PrimeColor } from '$lib/utils/PrimeColors';
import type { Meta, StoryObj } from '@storybook/svelte';

/**
 * The label component draws a HTML label on the 3d canvas.
 */
const meta = {
  title: 'Threlte/Label',
  component: Label,
  decorators: [() => CanvasWithAxis],
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: { type: 'select' },
      description: 'Vector3 position of the label.',
      options: ['Origin', 'In space'],
      mapping: {
        Origin: new Vector3(0, 0, 0),
        'In space': new Vector3(-1, 1, 1)
      }
    },
    size: {
      description: 'The font size in rem.'
    },
    color: {
      control: { type: 'select' },
      description:
        'The color of the label. We recommend using a [PrimeColor](/?path=/docs/colors--docs)',
      options: Object.keys(PrimeColor),
      mapping: PrimeColor
    },
    opacity: {
      description: 'The opacity of the label from 0 (transparent) to 1 (opaque).'
    },
    title: {
      description:
        'The text of the label. Alternatively you can use the default slot to populate this field.'
    }
  },
  args: {
    color: PrimeColor.red,
    title: 'Label',
    size: 1
  }
} satisfies Meta<Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
