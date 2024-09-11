<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
  import { Vector3 } from 'three';

  const { sorted = false } = $props();

  class WeavyLine {
    frequency: number;
    amplitude: number;
    type: 'sin' | 'cos';
    points: Vector3[];
    length: number;
    random: number = Math.random();

    constructor(frequency: number, type: 'sin' | 'cos') {
      this.frequency = frequency;
      this.amplitude = 1 + frequency / 10;
      this.type = type;

      const totalLength = 20;
      const resolution = 5 + frequency;
      const range = Array.from(
        { length: totalLength * resolution + 1 },
        (_, x) => x / resolution - totalLength / 2
      );

      this.points = range.map((x) => {
        const y =
          this.type === 'sin'
            ? Math.sin((x * this.frequency) / Math.PI)
            : Math.cos((x * this.frequency) / Math.PI);
        return new Vector3(x, y * this.amplitude, 0);
      });

      this.length = this.points.reduce((acc, point, i, points) => {
        if (i === 0) return 0;
        return acc + point.distanceTo(points[i - 1]);
      }, 0);
    }
  }

  const sines = new Array(21).fill(0).map((_, x) => new WeavyLine(x + 1, 'sin'));
  const cosines = new Array(21).fill(0).map((_, x) => new WeavyLine(x + 1, 'cos'));

  const lines = $derived.by(() => {
    const ls = [...sines, ...cosines];

    if (sorted) {
      ls.sort((a, b) => a.length - b.length);
    } else {
      ls.sort((a, b) => a.random - b.random);
    }

    return ls;
  });

  const width = 0.005;
</script>

{#key lines}
  {#each lines as line, i}
    <T.Group position.z={i / 4}>
      <T.Mesh>
        <MeshLineGeometry points={line.points} />

        <MeshLineMaterial
          {width}
          color={line.type == 'sin' ? PrimeColor.raspberry : PrimeColor.blue}
        />
      </T.Mesh>

      <T.Mesh position.z={0.01}>
        <MeshLineGeometry points={line.points} shape="none" />

        <MeshLineMaterial width={width * 1.5} color={'black'} />
      </T.Mesh>
    </T.Group>
  {/each}
{/key}
