<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import PlaneSegment from '$lib/utils/Segments';
  import type { Snippet } from 'svelte';

  type AutoPlanesProps = {
    values: number[];
    children: Snippet<[number, number, PlaneSegment, string]>;
  };

  let { values, children }: AutoPlanesProps = $props();

  const planeSegments = $derived.by(() => {
    if (!values) return [];

    // group values in array of indeces [1, 1, 2, 3, 1, 3] => { 1: [0,1,4], 2: [2], 3: [3,5] }
    const groups = values.reduce(
      (a, value, index) => {
        if (value in a) {
          a[value].push(index);
        } else {
          a[value] = [index];
        }

        return a;
      },
      {} as { [key: number]: number[] }
    );

    return values.map((v, index) => {
      const offset = groups[v].findIndex((i) => i === index);
      const interval = groups[v].length;
      return new PlaneSegment(32, offset, interval);
    });
  });

  const zipValueSegments = $derived(values.map((v, i) => [v, planeSegments[i]] as const));
</script>

{#each zipValueSegments as [value, planeSegment], index}
  {@render children(value, index, planeSegment, PrimeColor.getColor(index))}
{/each}
