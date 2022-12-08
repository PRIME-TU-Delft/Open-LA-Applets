<script lang="ts">
  import { T } from '@threlte/core';
  import { BufferGeometry, Color, Line, LineBasicMaterial, Vector3 } from 'three';

  export let color: string = 'Black';
  export let points: [Vector3, Vector3];
  export let origin: Vector3 = new Vector3(0, 0, 0);
  export let pointsOnArc: number = 15;

  export let u = new Vector3(0, 1, 0);

  //a detailed explanation of used math can be found in  Open LA book Teams -> developers interactivity -> files -> cirkelboog.pdf

  //calculates a point on the arc between points with a given t
  function rTemp(t: number, is180: boolean) {
    const a = points[0].clone();
    const b = is180 ? u.clone() : points[1].clone();

    return a.multiplyScalar(Math.cos(t)).add(b.multiplyScalar(Math.sin(t)));
  }

  //calulates all points on the arc by increasing t in increments and using rtemp
  function calculatePoints() {
    let arcPoints: Vector3[] = [];

    let is180: boolean = points[0].dot(points[1]) == -points[0].length() * points[1].length();

    let limitT = is180 ? Math.PI : Math.PI / 2;

    let counter = 0;
    while (counter <= pointsOnArc) {
      const t = counter * (limitT / pointsOnArc);
      const r = rTemp(t, is180);
      let newPoint = r.multiplyScalar(points[0].length() / r.length()).add(origin);
      arcPoints.push(newPoint);

      if (!is180) {
        u = newPoint.clone();
      }
      counter++;
    }

    return arcPoints;
  }

  let curvePoints = calculatePoints();

  $: geometry = new BufferGeometry().setFromPoints(curvePoints);
</script>

<T.Line {geometry}>
  <T.LineBasicMaterial {color} />
</T.Line>
