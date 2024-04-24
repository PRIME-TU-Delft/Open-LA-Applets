<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Controls } from '$lib/utils/Controls';

  const vDir = new Vector3(3, 2, -3);
  const lineDir = vDir.clone().normalize().multiplyScalar(10);
  let controls = Controls.addSlider(vDir.length(), -9, 9, 0.5, PrimeColor.raspberry);

  // Do not allow the vector to be zero, otherwise the direction is not defined
  $: vLength = Math.abs(controls[0]) <= 0.0001 ? 0.5 : controls[0];

  $: v = vDir.clone().normalize().multiplyScalar(vLength); // Direction of vector v
</script>

<Canvas3D bind:controls>
  <Vector3D alwaysOnTop direction={v} length={v.length()} color={PrimeColor.raspberry} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={v.clone().add(new Vector3(0, 0.4, 0))}
    color={PrimeColor.raspberry}
  />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.darkGreen} />
  <Latex3D
    latex={'Span\\{\\mathbf{v}\\}'}
    position={lineDir.clone().add(new Vector3(0, 0.4, 0))}
    color={PrimeColor.darkGreen}
  />
  <Axis3D />
</Canvas3D>
