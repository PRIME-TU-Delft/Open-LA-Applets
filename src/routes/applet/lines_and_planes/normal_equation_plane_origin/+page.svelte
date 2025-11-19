<script lang="ts">
  import { Vector3 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import { _ } from 'svelte-i18n';
  const n = new Vector3(1, 3, 2);
  const _q = new Vector3(1, 1, -((n.x + n.y) / n.z));
  const q = _q.cross(n).normalize().multiplyScalar(n.length());
</script>

<Canvas3D
  cameraPosition={new Vector3(-10, 3.8, 13.6)}
  cameraZoom={46}
  title={$_('applets.lines_and_planes.normal_equation_plane_origin.title')}
>
  <PlaneFromNormal normal={n} color={PrimeColor.yellow} />

  <!-- Normal -->
  <Vector3D direction={n} color={PrimeColor.blue} length={n.length()} />
  <Latex3D latex={'\\mathbf{n}'} position={n} extend={0.2} color={PrimeColor.blue} />

  <!-- Q -->
  <Vector3D direction={q} color={PrimeColor.raspberry} length={q.length()} />
  <Point3D position={q} color={PrimeColor.darkGreen} />
  <Latex3D latex="Q" position={q} extend={0.4} color={PrimeColor.darkGreen} />

  <Angle3D vs={[n, q]} />

  <Axis3D axisLength={7} />
</Canvas3D>
