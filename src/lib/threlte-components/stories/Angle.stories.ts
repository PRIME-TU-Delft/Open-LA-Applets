import type { Meta, StoryObj } from '@storybook/svelte';

import Angle from '../Angle.svelte';
import { Vector3 } from 'three';
import CanvasWithAxis from './CanvasWithAxis.svelte';
import { PrimeColor } from '$lib/utils/PrimeColors';

/**
 * The angle component is used to display an angle in 3D space. When angles are close to 90 degrees, they are forced to be right angles.
 */
const meta = {
  title: 'Threlte/Angle',
  component: Angle,
  decorators: [() => CanvasWithAxis],
  tags: ['autodocs'],
  argTypes: {
    vs: {
      control: { type: 'select' },
      description:
        'The two vectors that make up the angle. The angle is the angle between the two vectors.',
      options: ['90deg angle', '45deg angle', '180deg angle'],
      mapping: {
        '90deg angle': [new Vector3(1, 0, 0), new Vector3(0, 1, 0)],
        '45deg angle': [new Vector3(1, 1, 0), new Vector3(1, 0, 0)],
        '180deg angle': [new Vector3(-1, 0, 0), new Vector3(1, 0, 0)]
      }
    },
    size: {
      description:
        'The size of the angle. This is the length/radius of the lines that make up the angle.'
    },
    origin: {
      description: 'The origin of the angle. This is the point where the angle starts.'
    },
    color: {
      control: { type: 'select' },
      description:
        'The color of the angle. We recommend using a [PrimeColor](/?path=/docs/colors--docs)',
      options: Object.keys(PrimeColor),
      mapping: PrimeColor
    }
  },
  args: {
    color: PrimeColor.red
  }
} satisfies Meta<Angle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    vs: [new Vector3(1, 1, 0), new Vector3(1, 0, 0)],
    size: 2,
    color: PrimeColor.red,
    title: 'Angle'
  }
};

/**
 * The origin of the angle can be changed to any point in 3D space with a `Vector3`.
 */
export const WithOrigin: Story = {
  args: {
    ...Default.args,
    origin: new Vector3(0, 1, 0)
  }
};

/**
 * forceRightAngle can be used to force the angle to be a right angle. This is used when a right angle is needed but the angle is not exactly 90 degrees.
 */
export const forceRightAngle: Story = {
  args: {
    ...Default.args,
    forceRightAngle: true
  }
};

/**
 * Forcing an angle to become rounded can be used to achieve a round angle. This is especially useful when an angle is close to 90 degrees but needs to be rounded.
 */
export const forceRoundAngle: Story = {
  args: {
    ...Default.args,
    vs: [new Vector3(0, 1, 0), new Vector3(1, 0, 0)],
    forceRoundAngle: true
  }
};
