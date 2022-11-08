<script lang="ts">
  import { beforeUpdate } from 'svelte';

  import { Line } from '@threlte/core';
  import { Color, LineBasicMaterial, Vector3 } from 'three';

  import getRandomColor from 'ui/utils/primeColors';

  export let color = getRandomColor();
  export let points: [Vector3, Vector3] = [new Vector3(5, 0, 0), new Vector3(5, 0, 0)];

  const material = new LineBasicMaterial({ color: color });

  /**
   * When points color property is change => change material color.
   */
  beforeUpdate(() => {
    // Check if color is a valid css color accepts: [#fff, #f0f0f0, rgb(255, 255, 255), rgba(255, 255, 255, 1)] | rejects: [random, #rgba]
    if (!CSS.supports('color', color)) return;

    const newColor = new Color(color);

    // Check if color is updated
    if (!newColor.equals(material.color)) {
      material.color.set(newColor);
    }
  });
</script>

<Line {points} {material} />
