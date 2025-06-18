import type { Controller, Controls } from '$lib/controls/Controls';
import type { Draggable } from '$lib/controls/Draggables.svelte';
import type { Formula } from '$lib/utils/Formulas';
import type { Snippet } from 'svelte';

export type SceneProps = {
  controls?: Controls<any, readonly Controller<number | boolean | string | any>[]>;
  formulas?: Formula[];
  splitFormulas?: Formula[];
  showFormulasDefault?: boolean;
  draggables?: Draggable[];
  title?: string;
  sceneChildren?: Snippet<[number, number]>;
};
