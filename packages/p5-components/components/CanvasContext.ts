import { defineService } from 'utils/ContextService';
import type p5 from 'p5';

export type DrawFn = (p5: p5) => void;

interface CanvasContext {
  addDrawFn: (fn: DrawFn) => void;
  removeDrawFn: (fn: DrawFn) => void;
}

// Expose the canvas context service
export const [getCanvasContext, setCanvasContext] = defineService<CanvasContext>('canvas');
