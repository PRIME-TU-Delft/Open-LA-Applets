<script lang="ts">
  import { T } from '@threlte/core';
  import { DoubleSide, Vector3 } from 'three';
  import Line2 from './Line2.svelte';

  import getRandomColor from 'utils/PrimeColors';
  import Point from './Point.svelte';

  export let color: string = getRandomColor();
  export let origin: Vector3 = new Vector3(0, 0, 0);
  export let points: [Vector3, Vector3, Vector3] = [
    new Vector3(0, 0, 1),
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0)
  ];
  export let hasPoints: boolean = false;

  let vertices: Vector3[];
  let edges: [Vector3, Vector3][];

  $: {
    const p1 = points.at(0).clone().add(points.at(1));
    const p2 = points.at(0).clone().add(points.at(2));
    const p3 = points.at(1).clone().add(points.at(2));
    const p4 = points.at(0).clone().add(points.at(1)).add(points.at(2));
    vertices = [new Vector3(0, 0, 0), ...points, p1, p2, p3, p4];
    vertices = vertices.map((v) => v.clone().add(origin));

    edges = [
      [vertices.at(0), vertices.at(1)],
      [vertices.at(0), vertices.at(2)],
      [vertices.at(0), vertices.at(3)],
      [vertices.at(1), vertices.at(4)],
      [vertices.at(1), vertices.at(5)],
      [vertices.at(2), vertices.at(6)],
      [vertices.at(2), vertices.at(4)],
      [vertices.at(3), vertices.at(5)],
      [vertices.at(3), vertices.at(6)],
      [vertices.at(4), vertices.at(7)],
      [vertices.at(5), vertices.at(7)],
      [vertices.at(6), vertices.at(7)]
    ];
  }
</script>

<T.Mesh>
  <T.MeshLambertMaterial bind:color opacity={0.1} side={DoubleSide} transparent />
  <T.ConvexGeometry args={[vertices]} />
</T.Mesh>

{#if hasPoints}
  {#each vertices as vertex}
    <Point position={vertex} {color} />
  {/each}
{/if}

{#each edges as edge}
  <Line2 points={edge} {color} />
{/each}
