<script lang="ts">
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromPoints from '$lib/threlte/planes/PlaneFromPoints.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const p = new MathVector3(0, 2, 1);
  const q = new MathVector3(0, 5, 0);
  const r = new MathVector3(2, 1, 0);

  const pr = r.clone().sub(p.clone());
  const pq = q.clone().sub(p.clone());
</script>

<Canvas3D
  cameraPosition={new Vector3(7.7, 7.7, 13.47)}
  cameraZoom={41}
  title={{
    en: 'A parametric vector equation of a plane.',
    nl: 'Een parametrische vectorvergelijking van een vlak.'
  }}
>
  <PlaneFromPoints points={[p, q, r]} color={PrimeColor.yellow} />

  <!-- P -->
  <Point3D position={p} color={PrimeColor.cyan} alwaysOnTop />
  <Latex3D latex="P" position={p} extend={0.5} color={PrimeColor.cyan} />

  <!-- Q -->
  <Point3D position={q} color={PrimeColor.darkGreen} alwaysOnTop />
  <Latex3D latex="Q" position={q} extend={0.5} color={PrimeColor.darkGreen} />
  <Vector3D direction={pq} origin={p} color={PrimeColor.raspberry} noNormalise alwaysOnTop />

  <!-- R -->
  <Point3D position={r} color={PrimeColor.blue} alwaysOnTop />
  <Latex3D latex="R" position={r} extend={1} color={PrimeColor.blue} />
  <Vector3D direction={pr} origin={p} color={PrimeColor.orange} noNormalise alwaysOnTop />

  <Axis3D axisLength={7} showNumbers />
</Canvas3D>
