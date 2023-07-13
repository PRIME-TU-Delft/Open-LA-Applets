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
        showNumbers: { type: "boolean" },
        hideTicks: { type: "boolean" },
        axisLength: { type: "number" },
        axisSpacing: { type: "number" },
        floor: { type: "boolean" }
    },
} satisfies Meta<Axis>;


export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Default: Story = {
    args: {
        floor: false
    }
};