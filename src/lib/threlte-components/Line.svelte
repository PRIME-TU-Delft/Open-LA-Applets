<script lang="ts">
  import { T } from '@threlte/core';
  import { BufferGeometry, Vector3, Line } from 'three';

  import getRandomColor from '$lib/utils/PrimeColors';

  export let color: string = getRandomColor();
  export let points: [Vector3, Vector3] = [new Vector3(5, 0, 0), new Vector3(5, 0, 0)];
  export let isDashed = false;

  $: geometry = new BufferGeometry().setFromPoints(points);

  let line: Line;

  $: {
    if (line && isDashed) {
      line.computeLineDistances();
    }
  }
</script>

<T.Line bind:ref={line} {geometry}>
  {#if isDashed}
    <T.LineDashedMaterial {color} dashSize={0.1} gapSize={0.05} />
  {:else}
    <T.LineBasicMaterial {color} />
  {/if}
</T.Line>
