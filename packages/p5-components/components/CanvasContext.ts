import { defineService } from 'utils/ContextService';
import type p5 from 'p5';
import { Writable } from 'svelte/store';

export type DrawFn = (p5: p5) => void;

interface CanvasContext {
  // TODO: set key with symbol
  addDrawFn: (fn: DrawFn, isRelative: boolean) => void;
  removeDrawFn: (fn: DrawFn, isRelative: boolean) => void;
  mouseX: Writable<number>;
  mouseY: Writable<number>;
  width: Writable<number>;
  height: Writable<number>;
  scale: Writable<number>;
}

// Expose the canvas context service
export const [getCanvasContext, setCanvasContext] = defineService<CanvasContext>('canvas');
export const [getRelativeContext, setRelativeContext] = defineService<boolean>('relative');
