import { defineService } from '$lib/utils/ContextService';
import type p5 from 'p5';
import type { Writable } from 'svelte/store';
import type { Vector2 } from 'three';

export type DrawFn = (p5: p5) => void;

interface CanvasContext {
  addDrawFn: (fn: DrawFn, key: symbol, isRelative: boolean) => void;
  removeDrawFn: (key: symbol) => void;
  mouseX: Writable<number>;
  mouseY: Writable<number>;
  width: Writable<number>;
  height: Writable<number>;
  scale: Writable<number>;
}

// Expose the canvas context service
export const [getCanvasContext, setCanvasContext] = defineService<CanvasContext>('canvas');
export const [getRelativeContext, setRelativeContext] = defineService<boolean>('relative');
export const [getLabelPosition, setLabelPosition] = defineService<Writable<Vector2>>('label');