<script lang="ts">
  import { Vector3 } from 'three';

  import { PlaneFromNormal } from 'visuals-3d';

  import { PrimeColor } from 'ui/utils/primeColors';
  import { PlaneSegments } from 'visuals-3d/utils/Segments';

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
    return normalSegments.concat(pointSegments);
  }

  $: planeSegments = calculateSegments(normals, points);
</script>

<!-- TODO: if points and normals are both defined -->
{#if normals.length}
  {#each normals as normal, i}
    <PlaneFromNormal
      planeSegment={planeSegments[i]}
      {normal}
      color={colors[i % colors.length]}
      {opacity}
    />
  {/each}
{:else if points.length}
  {#each points as point, i}
    <PlaneFromNormal
      planeSegment={new PlaneSegments(segments, 0, 1)}
      {point}
      color={colors[i % colors.length]}
      {opacity}
    />
  {/each}
{/if}
