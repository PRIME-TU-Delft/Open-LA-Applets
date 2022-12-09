<script lang="ts">
  import { Vector3 } from 'three';
  import { Label } from 'utils/Label';
  import { PrimeColor } from 'utils/PrimeColors';
  import { Equation, Vector3D, Canvas3D, Axis3D, Label3D, PlaneFromPoints } from 'visuals-3d';
  import Point3D from 'visuals-3d/components/Point3D.svelte';

  let label = Label.default();

  const p = new Vector3(0, 1, 2);
  const pColor = PrimeColor.pink;
  const pLabelPos = p.clone().add(new Vector3(0, 0.3, 0));

  const r = new Vector3(2, 0, 1);
  const pr = r.clone().add(p.clone().multiplyScalar(-1));
  const rColor = PrimeColor.ultramarine;
  const rLabelPos = r.clone().add(new Vector3(0, 0.3, 0));

  const q = new Vector3(0, 0, 5);
  const qColor = PrimeColor.green;
  const pq = q.clone().add(p.clone().multiplyScalar(-1));
  const qLabelPos = q.clone().add(new Vector3(0, 0.3, 0));
</script>

<Canvas3D
  title="A parametric vector equation of a plane."
  isPerspectiveCamera={false}
  cameraPos={[2, 0.5, 2]}
>
  <PlaneFromPoints points={[p, q, r]} color={PrimeColor.yellow} />

  <!-- p -->
  <Point3D position={p} color={pColor} />
  <Label3D size={label.size * 15} position={pLabelPos} color={pColor}>
    <Equation s={`\\[ P \\]`} />
  </Label3D>

  <!-- r -->
  <Vector3D direction={pr} origin={p} color={PrimeColor.red} length={pr.length()} />
  <Point3D position={r} color={rColor} />
  <Label3D size={label.size * 15} position={rLabelPos} color={rColor}>
    <Equation s={`\\[ R \\]`} />
  </Label3D>

  <!-- q -->
  <Vector3D direction={pq} origin={p} color={PrimeColor.red} length={pq.length()} />
  <Point3D position={q} color={qColor} />
  <Label3D size={label.size * 15} position={qLabelPos} color={qColor}>
    <Equation s={`\\[ Q \\]`} />
  </Label3D>

  <Axis3D />
</Canvas3D>
