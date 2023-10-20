<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Vector3 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  import {
    Axis3D,
    Canvas3D,
    Latex3D,
    PlaneFromPoints,
    Point3D,
    Vector3D
  } from '$lib/threlte-components';

  const p = new MathVector3(0, 2, 1);
  const q = new MathVector3(0, 5, 0);
  const r = new MathVector3(2, 1, 0);

  const pr = r.clone().sub(p.clone());
  const pq = q.clone().sub(p.clone());
</script>

<Canvas3D
  cameraPosition={new Vector3(7.7, 7.7, 13.47)}
  zoom={41}
  title="A parametric vector equation of a plane."
>
  <PlaneFromPoints points={[p, q, r]} color={PrimeColor.yellow} />

  <!-- P -->
  <Point3D position={p} color={PrimeColor.pink} />
  <Latex3D latex={'P'} position={p} offset={0.5} color={PrimeColor.pink} />

  <!-- Q -->
  <Point3D position={q} color={PrimeColor.green} />
  <Latex3D latex={'Q'} position={q} offset={0.5} color={PrimeColor.green} />
  <Vector3D direction={pq} origin={p} color={PrimeColor.red} length={pq.length()} />

  <!-- R -->
  <Point3D position={r} color={PrimeColor.ultramarine} />
  <Latex3D latex={'R'} position={r} offset={1} color={PrimeColor.ultramarine} />
  <Vector3D direction={pr} origin={p} color={PrimeColor.red} length={pr.length()} />

  <Axis3D axisLength={7} showNumbers />
</Canvas3D>
