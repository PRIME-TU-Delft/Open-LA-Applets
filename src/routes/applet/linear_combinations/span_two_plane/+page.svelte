<script>
  import { Vector3 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromPoints from '$lib/threlte/planes/PlaneFromPoints.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';

  const u = new Vector3(1, 2, -2); // Vector u
  const v = new Vector3(3, 1, 0); // Vector v

  const labelPosition = u.clone().add(v).normalize().multiplyScalar(8); // only used for label -> Span{u,v}
</script>

<Canvas3D title="Span of two vectors">
  <!-- Vector u -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.raspberry} />
  <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.raspberry} />

  <!-- Vector v -->
  <Vector3D direction={v} length={v.length()} color={PrimeColor.raspberry} />
  <Latex3D latex={'\\mathbf{v}'} position={v} color={PrimeColor.raspberry} />

  <!-- Plane span -->
  <PlaneFromPoints points={[new Vector3(0, 0, 0), u, v]} color={PrimeColor.yellow} size={15} />
  <Latex3D
    latex={'\\mathrm{Span}\\{\\mathbf{u},\\mathbf{v}\\}'}
    position={labelPosition}
    extend={1.5}
  />

  <Axis3D />
</Canvas3D>
