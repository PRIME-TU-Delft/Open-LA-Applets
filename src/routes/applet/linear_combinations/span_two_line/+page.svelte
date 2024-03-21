<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Controls } from '$lib/utils/Controls';

  let controls = Controls.addSlider(2, -5, 5, 0.5, PrimeColor.raspberry).addSlider(
    5,
    -5,
    5,
    0.5,
    PrimeColor.yellow
  );

  $: v = new Vector3(3, 2, -3).normalize().multiplyScalar(3); // Vector v;
  $: u = v.clone().multiplyScalar(2); // Vector u = 2 * v;
  $: lineDir = v.clone().normalize().multiplyScalar(10);
</script>

<Canvas3D bind:controls>
  <Vector3D direction={v} length={controls[0]} striped radius={0.08} color={PrimeColor.raspberry} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={v.clone().normalize().multiplyScalar(controls[0])}
    offset={0.5}
    color={PrimeColor.raspberry}
  />

  <Vector3D direction={u} length={controls[1]} color={PrimeColor.yellow} />
  <Latex3D
    latex={'\\mathbf{u}'}
    position={u.clone().normalize().multiplyScalar(controls[1])}
    offset={0.8}
    color={PrimeColor.yellow}
  />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.blue} />
  <Latex3D latex={'\\mathrm{Span}\\{\\mathbf{u,v}\\}'} position={lineDir} offset={0.8} />
  <Axis3D />
</Canvas3D>
