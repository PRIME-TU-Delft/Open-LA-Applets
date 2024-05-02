<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { BufferGeometry, Line, Vector3 } from 'three';
  import Line2 from './Line2.svelte';

  export let color: string = PrimeColor.getRandomColor();
  export let points: [Vector3, Vector3] = [new Vector3(5, 0, 0), new Vector3(5, 0, 0)];
  export let isDashed = false;
  export let radius: number | undefined = undefined;

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

{#if radius}
  <Line2 origin={points[0]} endPoint={points[1]} {color} striped={isDashed} {radius} />
{/if}
