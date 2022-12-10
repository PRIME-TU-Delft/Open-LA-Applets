<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from 'threlte-components';
  import { PrimeColor } from 'utils/PrimeColors';

  $: vDir = new Vector3(3, 2, -3);
  $: uDir = vDir.clone().add(vDir.clone().normalize().multiplyScalar(2));
  $: lineDir = vDir.clone().normalize().multiplyScalar(10);
</script>

<Canvas3D>
  <Vector3D direction={vDir} length={vDir.length()} color={PrimeColor.red} />
  <Latex3D latex={'\\vec{v}'} position={vDir} />

  <Vector3D
    origin={vDir}
    direction={uDir}
    length={uDir.length() - vDir.length()}
    color={PrimeColor.yellow}
  />
  <Latex3D latex={'\\vec{u}'} position={uDir} />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.ultramarine} />
  <Latex3D latex={'Span\\{\\vec{v}\\}'} position={lineDir} />
  <Axis3D />
</Canvas3D>
