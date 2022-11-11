<script lang="ts">
  // TODO: optimise this component
  import { Vector3 } from 'three';

  import PlaneFromNormal from './PlaneFromNormal.svelte';

  import { PrimeColor } from 'utils/PrimeColors';
  import PlaneSegments from './PlaneSegments';

  export let normals: Vector3[] = [];
  export let points: Vector3[] = [];
  export let colors = Object.values(PrimeColor);
  export let opacity = 0.8;
  export let segments = 32;

  function calculateSegmentsVector3(vs: Vector3[]) {
    let diff = vs.map(() => false);

    for (let i = 0; i < vs.length; i++) {
      const thsPlusOne = (i + 1) % vs.length;
      if (vs[i].equals(vs[thsPlusOne])) {
        diff[i] = true;
        diff[thsPlusOne] = true;
      }
    }

    let diffSize = diff.filter((d) => d).length;

    if (diffSize == 0) {
      return vs.map(() => PlaneSegments.Default);
    }

    let j = 0;
    return diff.map((d) => {
      if (!d) return PlaneSegments.Default;
      else return new PlaneSegments(segments, j++, diffSize);
    });
  }

  function calculateSegmentsVector(vs: Vector3[]) {
    if (vs.length == 2 && vs[0].equals(vs[1])) {
      return [new PlaneSegments(segments, 0, 2), new PlaneSegments(segments, 1, 2)];
    }

    if (vs.length == 3) return calculateSegmentsVector3(vs);

    return vs.map(() => PlaneSegments.Default);
  }

  function calculateSegments(normals: Vector3[], points: Vector3[]) {
    const normalSegments = calculateSegmentsVector(normals);
    const pointSegments = calculateSegmentsVector(points);

    // TODO: check if normals are same but points are different
    return pointSegments.concat(normalSegments);
  }

  $: planeSegments = calculateSegments(normals, points);
</script>

<!-- TODO: if points and normals are both defined -->
{#if normals.length >= points.length}
  {#each normals as normal, i}
    <PlaneFromNormal
      {normal}
      position={points[i % points.length]}
      planeSegment={planeSegments[i]}
      color={colors[i % colors.length]}
      {opacity}
    />
  {/each}
{:else if points.length}
  {#each points as position, i}
    <PlaneFromNormal
      {position}
      normal={new Vector3(1, 3, 1)}
      color={colors[i % colors.length]}
      planeSegment={planeSegments[i]}
      {opacity}
    />
  {/each}
{/if}
