<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Controls } from '$lib/utils/Controls';

  const vDir = new Vector3(3, 2, -3);
  const lineDir = vDir.clone().normalize().multiplyScalar(10);
  let controls = Controls.addSlider(vDir.length(), -9, 9, 0.5, PrimeColor.raspberry);

  $: v = new Vector3(3, 2, -3).normalize().multiplyScalar(3); // Vector v;
  $: vLen = Math.abs(controls[0]) < 1 ? (controls[0] < 0 ? -1 : 1) : controls[0];
</script>

<Canvas3D bind:controls>
  <Vector3D direction={vDir} length={vLen} color={PrimeColor.raspberry} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={v.clone().normalize().multiplyScalar(controls[0]).add(new Vector3(0, 0.4, 0))}
    color={PrimeColor.raspberry}
  />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.darkGreen} />
  <Latex3D
    latex={'\\mathbf{Span}\\{\\mathbf{v}\\}'}
    position={lineDir.add(new Vector3(0, 0.4, 0))}
    color={PrimeColor.black}
  />
  <Axis3D />
</Canvas3D>
