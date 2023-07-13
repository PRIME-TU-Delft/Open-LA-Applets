import type { Meta, StoryObj } from '@storybook/svelte';

import CanvasWrapper from './CanvasWithBlock.svelte';
import { type Slider as SliderType, Sliders } from 'utils/Slider';

let sliders = new Sliders().addSlider(0);
let multiSlider = new Sliders().addSlider(0).addSlider(1)

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
    title: 'Threlte/Canvas',
    component: CanvasWrapper,
    // tags: ['autodocs'],
    argTypes: {
        enablePan: { type: 'boolean', defaultValue: false, description: "The ability to enable move (translate) the applet. On devices with a mouse this can be controlled by right mouse button dragging. On touchscreen devices, this can be done by dragging with two finders on the screen." },
        title: { type: 'string', description: 'Title of the canvas, is only visible if the applet has an title and is in (fullscreen or not iframe mode)' },
        background: { type: 'string', control: 'color', description: 'Background color of the canvas' },
        zoom: { type: 'number', defaultValue: 29, description: "Default zoom level into the applet" },
        showFormulasDefault: { type: 'boolean' },
        isIframe: { type: 'boolean' },
        sliders: { defaultValue: [] }
        // sliders: { type: SBType<SliderType[]> } TODO: define type
    },
    args: {
        enablePan: false,
        zoom: 29,
        sliders: [],
    }
} satisfies Meta<CanvasWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primairy: Story = {
    args: {
        sliders,
    }
};

export const WithTitle: Story = {
    args: {
        ...Primairy.args,
        title: "Applet with this and that mathematical properties"
    }
};

export const IsIframe: Story = {
    args: {
        ...Primairy.args,
        isIframe: true
    }
};

export const MultipleSlider: Story = {
    args: {
        ...Primairy.args,
        sliders: multiSlider
    }
};