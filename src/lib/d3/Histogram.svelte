<script module>
  export type HistogramProps = {
    freqMap: { [x: number]: number };
    normalizedHeight?: number;
    color?: PrimeColor;
    isInteger?: boolean;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';

  import Rect2D from './Rect2D.svelte';
  import type { PrimeColor } from '$lib/utils/PrimeColors';
  import Line2D from './Line2D.svelte';
  import Point2D from './Point2D.svelte';

  const { freqMap, normalizedHeight, color, isInteger = false }: HistogramProps = $props();

  const highestFreq = $derived(Math.max(...Object.values(freqMap)));
</script>

{#each Object.entries(freqMap) as [x, freq], _ (x)}
  {@const x_num = +x}
  {@const height = normalizedHeight === undefined ? freq : (freq / highestFreq) * normalizedHeight}

  {#if !isInteger}
    <Rect2D
      points={[new Vector2(x_num, 0), new Vector2(x_num + 1, height)]}
      color={color?.toString()}
    />
  {:else}
    <Line2D
      start={new Vector2(x_num, 0)}
      end={new Vector2(x_num, height)}
      color={color?.toString()}
    />
    <Point2D color={color?.toString()} position={new Vector2(x_num, height)} />
  {/if}
{/each}
