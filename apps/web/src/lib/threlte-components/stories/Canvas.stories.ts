import type { Meta, StoryObj } from '@storybook/svelte';

import { Sliders } from 'utils/Slider';
import CanvasWrapper from './CanvasWithBlock.svelte';


/**
 * The canvas element is the most crutial component for rendering an applet. All applets are wrapped in this parent component to facilitate basic threlte interactivity and UI visuals.
 */
const meta = {
    title: 'Threlte/Canvas',
    component: CanvasWrapper,
    tags: ['autodocs'],
    argTypes: {
        enablePan: { type: 'boolean', defaultValue: false },
        title: { type: 'string', description: 'Title of the canvas, is only visible if the applet has an title and is in (fullscreen or not iframe mode)' },
        background: { type: 'string', control: 'color', description: 'Background color of the canvas' },
        zoom: { type: 'number', defaultValue: 29, description: "Default zoom level into the applet" },
        showFormulasDefault: { type: 'boolean' },
        isIframe: { type: 'boolean' },
        sliders: {
            options: ['No slider', 'One slider', 'Two sliders', 'Three sliders'],
            mapping: {
                "No slider": new Sliders(),
                "One slider": new Sliders().addSlider(0),
                "Two sliders": new Sliders().addSlider(0).addSlider(1),
                "Three sliders": new Sliders().addSlider(0).addSlider(1).addSlider(2),
            },
        },
        // sliders: { type: SBType<SliderType[]> } TODO: define type
    },
    args: {
        enablePan: false,
        zoom: 29,
        sliders: new Sliders(),
    }
} satisfies Meta<CanvasWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default story does not show any content, for simplicity we have added a red cube to this scene to show the canvas element. By default, the only UI elements are visible on the lower right corner of the screen. The UI elements include:
 * - A **Share and embed** button. This allows the user to share the applet with others or embed it on their own website.
 * - A **Reset** button. This resets the applet to its default state, including the camera position and zoom level and optional sliders.
 * - A **Fullscreen** button. This button allows the user to view the applet in fullscreen mode. This button is only visible if the user agent supports fullscreen mode. For more info see a support chart [here](https://caniuse.com/fullscreen).
 */
export const Primairy: Story = {
    args: {}
};

/**
 * The main use case for these applets is to use them within the open book. The argument `isIframe` is used to indicate that the applet is used within an iframe. This will add/hide the UI elements that are needed in this context.
 */
export const IsIframe: Story = {
    args: {
        isIframe: true,
        title: "Applet with this and that mathematical properties"
    }
};

/**
 * The `title` argument is used to add a title to the applet. If the applet is in iframe mode, it will only be visible in fullscreen mode (try it in the story above).
 */
export const WithTitle: Story = {
    args: {
        title: "Applet with this and that mathematical properties"
    }
};


/**
 * Zero to three sliders can be added to the applet. The sliders are used to change the value of a variable in the applet. 
 * The value of the sliders is stored as (x for the first slider, y for the second slider, z for the third slider) in the `sliders` prop.
 * 
 * > Warning the sliders are only functional if this parameter is passed as `bind:sliders` to the applet.
 */
export const MultipleSlider: Story = {
    args: {
        sliders: new Sliders().addSlider(0).addSlider(1).addSlider(2),
    }
};

/** 
 * > TODO: add a story with a slider that is not binded to the applet
 * */
export const CanvasWithFormulas: Story = {
    args: {

    }
};