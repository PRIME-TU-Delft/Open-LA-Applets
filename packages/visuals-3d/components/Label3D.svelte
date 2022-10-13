<script lang="ts">
  import { onMount, onDestroy, beforeUpdate, getContext } from 'svelte';
  import { Vector3 } from 'three';

  import { sceneKey, type SceneContext } from '../utils/sceneKey';
  import { CSS2DObject } from '../utils/CSS2DRenderer';

  export let size = 1;
  export let color = '#000';
  export let position: Vector3 = new Vector3(0, 0, 0);
  export const strokeColor = ''; // TODO
  export const strokeWidth = 0; // TODO
  export let opacity = 1;
  export let layer: number | undefined = undefined;

  // Import scene from root Canvas.svelte. Context is used because store is too global.
  // More info: https://svelte.dev/docs#run-time-svelte-setcontext
  const { scene } = getContext<SceneContext>(sceneKey);

  let label: CSS2DObject;
  let labelElement: HTMLDivElement;

  onMount(() => {
    label = new CSS2DObject(labelElement);
    label.position.set(position.x, position.y, position.z);

    if (layer) {
      label.layers.set(layer);
    }

    scene.add(label);
  });

  beforeUpdate(() => {
    if (!label) return;
    // TODO: update rest of properties

    if (!label.position.equals(position)) {
      label.position.set(position.x, position.y, position.z);
    }
  });

  onDestroy(() => {
    // TODO: remove label from scene
    // scene.remove(label);
  });
</script>

<div
  bind:this="{labelElement}"
  style="font-size: {size}rem; --color: {color}; opacity: {opacity}"
  class="label"
>
  <slot />
</div>

<style>
  .label {
    color: var(--color);
  }
</style>
