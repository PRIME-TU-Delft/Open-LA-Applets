<script lang="ts">
  import { T } from '@threlte/core';
  import { onDestroy } from 'svelte';
  import { BufferGeometry, Vector3 } from 'three';

  type Arc3DProps = {
    points: [Vector3, Vector3];
    color?: string;
    origin?: Vector3;
    pointsOnArc?: number;
  };

  let {
    points,
    color = 'black',
    origin = new Vector3(0, 0, 0),
    pointsOnArc = 15
  }: Arc3DProps = $props();

  let u = $state(points[0].clone());

  // a detailed explanation of used math can be found in  Open LA book Teams -> developers interactivity -> files -> cirkelboog.pdf

  // calculates a point on the arc between points with a given t
  function rTemp(t: number, is180: boolean) {
    const a = points[0].clone();
    const b = is180 ? u.clone() : points[1].clone();

    return a.multiplyScalar(Math.cos(t)).add(b.multiplyScalar(Math.sin(t)));
  }

  const geometry = $derived.by(() => {
    let arcPoints: Vector3[] = [];

    let is180: boolean = points[0].dot(points[1]) == -points[0].length() * points[1].length();

    let limitT = is180 ? Math.PI : Math.PI / 2;

    let counter = 0;
    while (counter <= pointsOnArc) {
      const t = counter * (limitT / pointsOnArc);
      const r = rTemp(t, is180);
      let newPoint = r.multiplyScalar(points[0].length() / r.length()).add(origin);
      arcPoints.push(newPoint);
      counter++;
    }

    return new BufferGeometry().setFromPoints(arcPoints);
  });

  onDestroy(() => {
    geometry.dispose();
  });
</script>

<T.Line {geometry}>
  <T.LineBasicMaterial {color} />
</T.Line>
