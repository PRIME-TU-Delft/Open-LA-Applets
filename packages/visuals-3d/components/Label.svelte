<script lang="ts">
  import { onMount, onDestroy, beforeUpdate, getContext } from 'svelte';
  import { Vector3 } from 'three';
  import SpriteText from 'three-spritetext';

  import { sceneKey, type SceneContext } from './utils/sceneKey';

  export let title: string;
  export let size: number = 0.1;
  export let color = '#000';
  export let position: Vector3 = new Vector3(0, 0, 0);
  export let strokeColor: string = '';
  export let strokeWidth: number = 0;

  // Import scene from root Canvas.svelte. Context is used because store is too global.
  // More info: https://svelte.dev/docs#run-time-svelte-setcontext
  const { scene } = getContext<SceneContext>(sceneKey);

  let text: SpriteText;

  onMount(() => {
    text = new SpriteText(title, size, color);

    if (strokeWidth) {
      text.strokeWidth = strokeWidth;
    }

    // Set stroke color if specified
    if (strokeColor && CSS.supports('color', strokeColor) && strokeColor != 'white') {
      text.strokeColor = strokeColor;
      text.strokeWidth = strokeWidth || 2;
    }

    text.position.set(position.x, position.y, position.z);
    text.geometry.attributes.position.needsUpdate = true;

    scene.add(text);
  });

  beforeUpdate(() => {
    if (!text) return;

    if (text.text !== title) {
      text.text = title;
    }

    if (text.textHeight !== size) {
      text.textHeight = size;
    }

    if (!text.position.equals(position)) {
      text.position.set(position.x, position.y, position.z);
    }
  });

  onDestroy(() => {
    scene.remove(text);
  });
</script>
