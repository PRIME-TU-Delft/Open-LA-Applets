<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  $: vDir = new Vector3(3, 2, -3); // Direction of vector v
  $: lineDir = vDir.clone().normalize().multiplyScalar(10); // Line L (v scaled)
</script>

<Canvas3D>
  <Vector3D direction={vDir} length={vDir.length()} color={PrimeColor.red} />
  <Latex3D latex={'\\bold{v}'} position={vDir.clone().add(new Vector3(0, 0.4, 0))} color={PrimeColor.red} />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.ultramarine} />
  <Latex3D latex={'Span\\{\\bold{v}\\}'} position={lineDir.add(new Vector3(0, 0.4, 0))} color={PrimeColor.ultramarine}/>
  <Axis3D />
</Canvas3D>
