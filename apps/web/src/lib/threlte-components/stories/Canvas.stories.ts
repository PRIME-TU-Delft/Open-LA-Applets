import type { Meta, StoryObj } from '@storybook/svelte';

import CanvasWrapper from './CanvasWrapper.svelte';
import { Sliders } from 'utils/Slider';

let sliders = new Sliders().addSlider(0);

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
    title: 'Threlte/Canvas',
    component: CanvasWrapper,
    tags: ['autodocs'],
    argTypes: {
        enablePan: { type: 'boolean' },
        title: { type: 'string' },
        background: { type: 'string' },
        zoom: { type: 'number' },
        showFormulasDefault: { type: 'boolean' },
    },
} satisfies Meta<CanvasWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Default: Story = {
    args: {
        sliders
    }
};