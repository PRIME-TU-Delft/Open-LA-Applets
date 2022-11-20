<script lang="ts">
  import { PrimeColor } from 'utils/primeColors';
  import PlaneSegments from 'utils/Segments';

  export let values: number[];

  function getPlaneSegments(vs: number[]): PlaneSegments[] {
    if (!vs) return [];

    // group values in array of indeces [1, 1, 2, 3, 1, 3] => { 1: [0,1,4], 2: [2], 3: [3,5] }
    const groups = vs.reduce((a, value, index, _) => {
      if (value in a) {
        a[value].push(index);
      } else {
        a[value] = [index];
      }

      return a;
    }, {} as { [key: number]: number[] });

    return vs.map((v, index) => {
      const offset = groups[v].findIndex((i) => i === index);
      const interval = groups[v].length;
      return new PlaneSegments(32, offset, interval);
    });
  }

  function getColor(index: number) {
    const colors = Object.values(PrimeColor);

    return colors[index % colors.length];
  }

  $: planeSegments = getPlaneSegments(values);
  $: zipValueSegments = values.map((v, i) => [v, planeSegments[i]] as [number, PlaneSegments]);
</script>

{#each zipValueSegments as [value, planeSegment], index}
  <slot {value} {index} {planeSegment} color={getColor(index)} />
{/each}
