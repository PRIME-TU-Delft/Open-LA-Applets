<script>
  import { Vector3 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import PlaneFromPoints from '$lib/threlte/planes/PlaneFromPoints.svelte';

  const b1 = new Vector3(2, -1, -2);
  const b2 = new Vector3(2, -1, 2);
  const b3 = b2.clone().cross(b1.clone()).normalize().multiplyScalar(b1.length()); // perpendicular to b1 and b2

  const b4 = $derived(b1.clone().add(b2).normalize()); // Span of b1 and b2 in the x direction
  const b5 = $derived(b1.clone().sub(b2).normalize()); // Span of b1 and b2 in the y direction
  const b1_proj = $derived(b1.clone().projectOnVector(b4)); // Projection of b1 onto b4
  const b2_proj = $derived(b2.clone().projectOnVector(b5)); // Projection of b2 onto b5
</script>

<Canvas3D title="Projection with respect to a suitable basis">
  <!-- Vector b1 -->
  <Vector3D direction={b1} length={b1.length()} color={PrimeColor.blue} />
  <Latex3D latex={'\\mathbf{b}_1'} position={b1} color={PrimeColor.blue} />

  <!-- Vector v -->
  <Vector3D direction={b2} length={b2.length()} color={PrimeColor.blue} />
  <Latex3D latex={'\\mathbf{b}_2'} position={b2} color={PrimeColor.blue} />

  <!-- Vector w = b1 + b2 -->
  <Vector3D direction={b3} length={b1.length()} color={PrimeColor.raspberry} />
  <Latex3D latex={'\\mathbf{b}_3'} position={b3} color={PrimeColor.raspberry} />

  <!-- Helper axis [black vectors] -->
  <Vector3D direction={b4} length={8.5} hideHead color={PrimeColor.orange} />
  <Vector3D
    direction={b4.clone().multiplyScalar(-1)}
    length={8.5}
    hideHead
    color={PrimeColor.orange}
  />
  <Vector3D direction={b5} length={8.5} hideHead color={PrimeColor.orange} />
  <Vector3D
    direction={b5.clone().multiplyScalar(-1)}
    length={8.5}
    hideHead
    color={PrimeColor.orange}
  />

  <!-- Projection b1 -->
  <Point3D position={b1_proj} color={PrimeColor.darkGreen} />
  <Vector3D
    origin={b1_proj}
    direction={b1.clone().sub(b1_proj)}
    length={b1.clone().sub(b1_proj).length()}
    color={PrimeColor.darkGreen}
    isDashed
  />

  <!-- Projection b2 -->
  <Point3D position={b2_proj} color={PrimeColor.darkGreen} />
  <Vector3D
    origin={b2_proj}
    direction={b2.clone().sub(b2_proj)}
    length={b2.clone().sub(b2_proj).length()}
    color={PrimeColor.darkGreen}
    isDashed
  />

  <!-- Angles - 90 deg angles between b1 and b3 | between b2 and b3 -->
  <Angle3D vs={[b1, b3]} />
  <Angle3D vs={[b2, b3]} />

  <!-- Plane span -->
  <PlaneFromPoints points={[new Vector3(0, 0, 0), b1, b2]} color={PrimeColor.yellow} size={15} />

  <Axis3D />
</Canvas3D>
