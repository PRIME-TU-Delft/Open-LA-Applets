import { writable, type Writable } from "svelte/store";
import type { Vector2 } from "three";

export class Draggable {
    position: Writable<Vector2>;
    color: string;
    key: Symbol;
    defaultPosition: Vector2;

    constructor(defaultPosition: Vector2, color: string) {
        this.position = writable(defaultPosition.clone());
        this.defaultPosition = defaultPosition.clone()
        this.color = color;
        this.key = Symbol('draggable');
    }

    reset() {
        this.position.set(this.defaultPosition);
    }
}

function createDragStore() {
    const { subscribe, set, update } = writable<Draggable[]>([]);

    return {
        subscribe,
        add: (draggable: Draggable) => update((draggables) => [...draggables, draggable]),
        remove: (key: Symbol) => update((draggables) => draggables.filter(draggable => draggable.key !== key)),
        reset: () => update((draggables) => { draggables.forEach(draggable => draggable.reset()); return draggables; }),
        destroy: () => set([])
    };
}

export const draggables = createDragStore();