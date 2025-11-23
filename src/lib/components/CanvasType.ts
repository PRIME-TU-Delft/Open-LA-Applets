import type { Controller, Controls } from '$lib/controls/Controls';
import type { Draggable } from '$lib/controls/Draggables.svelte';
import type { Formula } from '$lib/utils/Formulas';
import type { LegendItem } from '$lib/utils/Legend';
import type { Snippet } from 'svelte';

export type SceneProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controls?: Controls<any, readonly Controller<number | boolean | string | any>[]>;
  formulas?: Formula[];
  legendItems?: LegendItem[];
  splitFormulas?: Formula[];
  splitLegendItems?: LegendItem[];
  showFormulasDefault?: boolean;
  draggables?: Draggable[];
  title?: string;
  sceneChildren?: Snippet<[number, number]>;
};
