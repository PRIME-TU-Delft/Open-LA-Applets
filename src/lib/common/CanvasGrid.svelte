<script lang="ts" module>
  import Scene from '$lib/components/Scene.svelte';
  import type { Controller, Controls } from '$lib/controls/Controls';
  import type { Draggable } from '$lib/controls/Draggables.svelte';
  import type { Formula } from '$lib/utils/Formulas';
  import type { LegendItem } from '$lib/utils/Legend';
  import type { Snippet } from 'svelte';

  export const CANVAS_GRID_KEY = Symbol('canvas-grid');

  export type CanvasGridContext = {
    registerDraggables: (draggables: Draggable[]) => void;
    unregisterDraggables: (draggables: Draggable[]) => void;
  };

  export type CanvasGridProps = {
    rows: number;
    columns: number;
    title?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controls?: Controls<any, readonly Controller<number | boolean | string | any>[]>;
    formulas?: Formula[];
    legendItems?: LegendItem[];
    children: Snippet;
  };
</script>

<script lang="ts">
  import { setContext } from 'svelte';

  let {
    rows,
    columns,
    title,
    controls,
    formulas = [],
    legendItems = [],
    children
  }: CanvasGridProps = $props();

  let allDraggables = $state<Draggable[]>([]);

  setContext<CanvasGridContext>(CANVAS_GRID_KEY, {
    registerDraggables(draggables: Draggable[]) {
      allDraggables = [...allDraggables, ...draggables];
    },
    unregisterDraggables(draggables: Draggable[]) {
      allDraggables = allDraggables.filter((d) => !draggables.includes(d));
    }
  });
</script>

<Scene {title} draggables={allDraggables} {controls} {formulas} {legendItems}>
  {#snippet sceneChildren(width: number, height: number)}
    <div
      style="display: grid; grid-template-rows: repeat({rows}, 1fr); grid-template-columns: repeat({columns}, 1fr); width: {width}px; height: {height}px;"
    >
      {@render children()}
    </div>
  {/snippet}
</Scene>
