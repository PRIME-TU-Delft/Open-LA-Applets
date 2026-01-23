<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';

  const normal = new MathVector3(1, 2, 4);
  const normalizedNormal = normal.clone().normalize();
  const p = new MathVector3(0.5, 2, 1);

  const _q = new MathVector3(
    -((normalizedNormal.x + normalizedNormal.y) / normalizedNormal.z),
    1,
    1
  );
  const q = _q.cross(normalizedNormal).normalize().multiplyScalar(normal.length());
</script>

<Canvas3D
  cameraPosition={new MathVector3(12.4, -11, 5.4)}
  cameraZoom={46}
  title={$_('applets.lines_and_planes.normal_equation_plane.title')}
>
  <PlaneFromNormal {normal} position={p} color={PrimeColor.yellow} />

  <!-- Normal -->
  <Vector3D origin={p} direction={normal} color={PrimeColor.orange} length={normal.length()} />
  <Latex3D
    latex={'\\mathbf{n}'}
    position={p.clone().add(normal.clone())}
    extend={0.3}
    color={PrimeColor.orange}
  />

  <!-- P -->
  <Point3D position={p} color={PrimeColor.blue} />
  <Latex3D latex="P" position={p} extend={-0.5} color={PrimeColor.blue} />

  <!-- Q -->
  <Point3D position={q.clone().add(p)} color={PrimeColor.darkGreen} />
  <Latex3D latex="Q" position={q.clone().add(p)} extend={0.6} color={PrimeColor.darkGreen} />
  <Vector3D
    origin={p}
    direction={q}
    color={PrimeColor.raspberry}
    length={normal.length()}
    alwaysOnTop
  />

  <Angle3D vs={[normal, q]} origin={p} size={0.5} />

  <Axis3D axisLength={7} />
</Canvas3D>
