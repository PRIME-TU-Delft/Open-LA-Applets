<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  $: v = new Vector3(3, 2, -3).normalize().multiplyScalar(3); // Vector v;
  $: u = v.clone().multiplyScalar(2); // Vector u = 2 * v;
  $: lineDir = v.clone().normalize().multiplyScalar(10);
</script>

<Canvas3D>
  <Vector3D direction={v} length={v.length()} striped radius={0.08} color={PrimeColor.red} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={v.clone().add(new Vector3(0, 0.5, 0))}
    color={PrimeColor.red}
  />

  <Vector3D direction={u} length={u.length()} color={PrimeColor.yellow} />
  <Latex3D
    latex={'\\mathbf{u}'}
    position={u.clone().add(new Vector3(0, 0.5, 0))}
    color={PrimeColor.yellow}
  />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.blue} />
  <Latex3D
    latex={'Span\\{\\mathbf{v}\\}'}
    position={lineDir}
    offset={0.8}
    color={PrimeColor.blue}
  />
  <Axis3D />
</Canvas3D>
