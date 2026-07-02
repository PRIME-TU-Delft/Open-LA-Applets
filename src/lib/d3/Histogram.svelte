<script module>
  export type HistogramProps = {
    freqMap: { [x: number]: number };
    normalizedHeight?: number;
    color?: PrimeColor;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';

  import Rect2D from './Rect2D.svelte';
  import type { PrimeColor } from '$lib/utils/PrimeColors';

  const { freqMap, normalizedHeight, color }: HistogramProps = $props();

  const highestFreq = $derived(Math.max(...Object.values(freqMap)));
</script>

{#each Object.entries(freqMap) as [x, freq], _ (x)}
  {@const x_num = +x}
  {@const height = normalizedHeight === undefined ? freq : (freq / highestFreq) * normalizedHeight}
  <Rect2D
    points={[new Vector2(x_num, 0), new Vector2(x_num + 1, height)]}
    color={color?.toString()}
  />
{/each}
