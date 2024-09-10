<script>
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromPoints from '$lib/threlte/planes/PlaneFromPoints.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const b1 = new MathVector3(2, 0, 1);
  const b2 = new MathVector3(1, 1, 0);
  const b3 = new MathVector3(1, -1, -2);
</script>

<Canvas3D
  cameraPosition={new Vector3(12.25, 6.74, 9.53)}
  cameraZoom={40}
  title="Projection with respect to a suitable basis"
>
  <!-- Vector b1 -->
  <Vector3D direction={b1} length={b1.length()} color={PrimeColor.blue} />
  <Latex3D
    latex={'\\mathbf{b}_1=T_{\\epsilon}(\\mathbf{b}_1)'}
    position={b1}
    offset={new Vector3(0, 0.75, 0.5)}
    color={PrimeColor.blue}
    hasBackground
  />

  <!-- Vector v -->
  <Vector3D direction={b2} length={b2.length()} color={PrimeColor.blue} />
  <Latex3D
    latex={'\\mathbf{b}_2=T_{\\epsilon}(\\mathbf{b}_2)'}
    position={b2}
    offset={new Vector3(0.5, 0, 0.5)}
    color={PrimeColor.blue}
  />

  <!-- Vector w = b1 + b2 -->
  <Vector3D direction={b3} length={b1.length()} color={PrimeColor.raspberry} />
  <Latex3D latex={'\\mathbf{b}_3'} position={b3} color={PrimeColor.raspberry} />

  <Point3D position={new Vector3()} color={PrimeColor.raspberry} />
  <Latex3D
    latex={'T_{\\epsilon}(\\mathbf{b}_3)'}
    position={new Vector3()}
    offset={new Vector3(0.5, 0, -0.75)}
    color={PrimeColor.raspberry}
  />

  <!-- Angles - 90 deg angles between b1 and b3 | between b2 and b3 -->
  <Angle3D vs={[b1, b3]} />
  <Angle3D vs={[b2, b3]} />

  <!-- Plane span -->
  <PlaneFromPoints points={[new Vector3(0, 0, 0), b1, b2]} color={PrimeColor.yellow} size={10} />

  <Axis3D />
</Canvas3D>
