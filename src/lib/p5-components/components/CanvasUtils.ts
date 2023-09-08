import type p5 from "p5";
import type { Writable } from "svelte/store";
import { setCanvasContext, type DrawFn } from "./CanvasContext";

// Protocall for drawing functions
export class FnToDraw {
    constructor(public key: symbol, public fn: DrawFn) {
        this.key = key;
        this.fn = fn;
    }

    equals(other: FnToDraw) {
        return this.key === other.key;
    }
}

// Isolate draw function to prevent it from applying transformations and styles to other draw functions
export function isolate(draw: DrawFn): DrawFn {
    return (p5: p5) => {
        p5.push();
        draw(p5);
        p5.pop();
    };
}

// Change the scale to be relative to the center of the canvas
function setRelative(draw: DrawFn): DrawFn {
    return (p5: p5) => {
        p5.push();

        p5.scale(1, -1);
        p5.translate(p5.width / 2, -p5.height / 2);

        draw(p5);

        p5.pop();
    };
}

export type ContextParams = {
    mouseX: Writable<number>;
    mouseY: Writable<number>;
    width: Writable<number>;
    height: Writable<number>;
    scale: Writable<number>;
}

export function setDefaultContext(fnsToDraw: FnToDraw[], params: ContextParams) {
    setCanvasContext({
        addDrawFn: (fn: DrawFn, key: symbol, isRelative: boolean) => {
            fn = isolate(fn);

            if (isRelative) {
                fn = setRelative(fn);
            }

            fnsToDraw.push(new FnToDraw(key, fn));
        },
        removeDrawFn: (key: symbol) => {
            let index = fnsToDraw.findIndex((draw) => draw.key === key);

            if (index > -1) {
                fnsToDraw.splice(index, 1);
            }
        },
        // Warning: because mouseX and mouseY are not reactive, they are not always equal to the actual mouse position! Only when the mouse is being dragged.
        mouseX: params.mouseX,
        mouseY: params.mouseY,
        width: params.width,
        height: params.height,
        scale: params.scale,
    });
} 