<script lang="ts">
  import { onMount, beforeUpdate, getContext } from 'svelte';
  import { Vector3 } from 'three';

  import { sceneKey, type SceneContext } from 'utils/SceneKey';
  import { CSS2DObject } from 'utils/CSS2DRenderer';

  export let size = 1;
  export let color = '#000';
  export let position: Vector3 = new Vector3(0, 0, 0);
  export let opacity = 1;

  let _opacity = 0;

  // Import scene from root Canvas.svelte. Context is used because store is too global.
  // More info: https://svelte.dev/docs#run-time-svelte-setcontext
  const { scene } = getContext<SceneContext>(sceneKey);

  let label: CSS2DObject;
  let labelElement: HTMLDivElement;

  onMount(() => {
    label = new CSS2DObject(labelElement);
    label.position.set(position.x, position.y, position.z);

    scene.add(label);

    _opacity = opacity;
  });

  beforeUpdate(() => {
    if (!label) return;

    if (!label.position.equals(position)) {
      label.position.set(position.x, position.y, position.z);
    }

    _opacity = opacity;
  });
</script>

<div
  bind:this={labelElement}
  style="font-size: {size}rem; --color: {color}; opacity: {_opacity}"
  class="label"
>
  <slot />
</div>

<style lang="postcss">
  .label {
    @apply text-slate-700;
    /* color: var(--color); */
  }
</style>
