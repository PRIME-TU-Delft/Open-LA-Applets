<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import PlaneSegments from '$lib/utils/Segments';

  export let values: number[];

  function getPlaneSegments(vs: number[]): PlaneSegments[] {
    if (!vs) return [];

    // group values in array of indeces [1, 1, 2, 3, 1, 3] => { 1: [0,1,4], 2: [2], 3: [3,5] }
    const groups = vs.reduce(
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

    return vs.map((v, index) => {
      const offset = groups[v].findIndex((i) => i === index);
      const interval = groups[v].length;
      return new PlaneSegments(32, offset, interval);
    });
  }

  $: planeSegments = getPlaneSegments(values);
  $: zipValueSegments = values.map((v, i) => [v, planeSegments[i]] as [number, PlaneSegments]);
</script>

{#each zipValueSegments as [value, planeSegment], index}
  <slot {value} {index} {planeSegment} color={PrimeColor.getColor(index)} />
{/each}
