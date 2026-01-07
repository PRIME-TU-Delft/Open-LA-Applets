import type { SceneProps } from '$lib/components/Scene.svelte';
import type { Camera3DProps } from '$lib/threlte/CanvasType';
import type { Snippet } from 'svelte';
import { type Canvas2DProps } from './CanvasD3.svelte';

export type CanvasProps = SceneProps &
  Omit<Canvas2DProps, 'children' | 'width'> & {
    splitCanvas2DProps?: Omit<Canvas2DProps, 'children' | 'width' | 'height' | 'isSplit'>;
    splitCanvas3DProps?: Camera3DProps; // Not implemented yet
    children: Snippet;
    splitCanvas2DChildren?: Snippet;
    splitCanvas3DChildren?: Snippet;
    defaultLeftDivision?: number;
  };
