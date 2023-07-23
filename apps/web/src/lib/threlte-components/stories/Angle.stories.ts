import type { Meta, StoryObj } from '@storybook/svelte';

import Angle from '../Angle.svelte';
import CanvasWrapper from './CanvasWrapper.svelte';
import { Vector3 } from "three"

interface SBBaseType {
    required?: boolean;
    raw?: string;
}

type SBScalarType = SBBaseType & {
    name: 'boolean' | 'string' | 'number' | 'function' | 'symbol';
};

type SBArrayType = SBBaseType & {
    name: 'array';
    value: SBType;
};
type SBObjectType = SBBaseType & {
    name: 'object';
    value: Record<string, SBType>;
};
type SBEnumType = SBBaseType & {
    name: 'enum';
    value: (string | number)[];
};
type SBIntersectionType = SBBaseType & {
    name: 'intersection';
    value: SBType[];
};
type SBUnionType = SBBaseType & {
    name: 'union';
    value: SBType[];
};
type SBOtherType = SBBaseType & {
    name: 'other';
    value: string;
};

type SBType =
    | SBScalarType
    | SBEnumType
    | SBArrayType
    | SBObjectType
    | SBIntersectionType
    | SBUnionType
    | SBOtherType;

const v1 = new Vector3(1, 1, 0);

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
    title: 'Threlte/Angle',
    component: Angle,
    decorators: [() => CanvasWrapper],
    tags: ['autodocs'],
    argTypes: {
        origin: {
            description: "The origin of the angle. This is the point where the angle starts.", control: { type: 'object', options: v1 }
        },
    },
    args: {

    }
} satisfies Meta<Angle>;


export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Default: Story = {
    args: {
        vs: [
            new Vector3(1, 1, 0),
            new Vector3(0, 0, 1),
        ]
    }
};