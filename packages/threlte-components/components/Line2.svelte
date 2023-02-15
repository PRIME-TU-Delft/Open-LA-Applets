<script lang="ts">
  import { T } from '@threlte/core';
  import { Vector3, Line } from 'three';
  import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';

  import getRandomColor from 'utils/PrimeColors';

  export let color: string = getRandomColor();
  export let points: [Vector3, Vector3] = [new Vector3(5, 0, 0), new Vector3(5, 0, 0)];
  export let isDashed = false;
  export let radius = 0.05;

  let line: Line;

  $: {
    if (line) {
      const geometry = new LineGeometry();
      geometry.setPositions([
        points[0].x,
        points[0].y,
        points[0].z,
        points[1].x,
        points[1].y,
        points[1].z
      ]);

      line.geometry = geometry;

      if (isDashed) {
        line.computeLineDistances();
        line.scale.set(1, 1, 1);
      }
    }
  }
</script>

<T.Line2 bind:ref={line}>
  <T.LineMaterial dashed={isDashed} worldUnits linewidth={radius} dashScale={10} {color} />
</T.Line2>
