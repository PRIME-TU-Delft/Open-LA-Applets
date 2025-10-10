import type { Controller, Controls } from '$lib/controls/Controls';
import type { Draggable } from '$lib/controls/Draggables.svelte';
import type { LocalizedString } from '$lib/utils';
import type { Formula } from '$lib/utils/Formulas';
import type { Snippet } from 'svelte';

export type SceneProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controls?: Controls<any, readonly Controller<number | boolean | string | any>[]>;
  formulas?: Formula[];
  splitFormulas?: Formula[];
  showFormulasDefault?: boolean;
  draggables?: Draggable[];
  title?: LocalizedString | string;
  sceneChildren?: Snippet<[number, number]>;
};
