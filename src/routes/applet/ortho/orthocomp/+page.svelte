<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Vector3 } from 'three';

  let v = new Vector2(3, -3);
  let v_ortho = new Vector2(3, 3);

  let ve = new Vector3(0, 0, 0);
  let ve_ortho = new Vector3(0, 7, 0);

  const n0 = new Vector3(0, 1, 0);
</script>

<Canvas2D
  splitCanvas3DProps={{ cameraPosition: new Vector3(10, 10, 13), cameraZoom: 50 }}
  cameraZoom={1.5}
  title={{
    en: 'The orthogonal complement of a line (left) and a plane (right)',
    nl: 'Het orthogonale complement van een lijn (links) en een vlak (rechts)'
  }}
>
  <!-- v -->
  <Vector2D
    direction={v}
    length={v.length() * 2}
    color={PrimeColor.darkGreen}
    origin={v.clone().multiplyScalar(-1)}
  >
    <Latex2D
      latex="V"
      position={v.clone().add(new Vector2(-0.3, -0.1))}
      color={PrimeColor.darkGreen}
    />
  </Vector2D>

  <!-- v_ortho -->
  <Vector2D
    direction={v_ortho}
    length={v_ortho.length() * 2}
    color={PrimeColor.blue}
    origin={v_ortho.clone().multiplyScalar(-1)}
  >
    <Latex2D
      latex={'V^{\\bot}'}
      position={v_ortho.clone().add(new Vector2(-0.3, 0.3))}
      color={PrimeColor.blue}
    />
  </Vector2D>

  <!-- Arcs -->
  <RightAngle2D vs={[v, v_ortho]} lineWidth={0.03} />

  {#snippet splitCanvas3DChildren()}
    <!-- v -->
    <PlaneFromNormal position={ve} normal={n0} color={PrimeColor.darkGreen} />
    <Latex3D latex="V" position={new Vector3(5.1, 0, 5.2)} color={PrimeColor.darkGreen} />

    <!-- v_ortho -->
    <Vector3D
      direction={ve_ortho}
      length={ve_ortho.length() * 2}
      color={PrimeColor.blue}
      origin={ve_ortho.clone().multiplyScalar(-1)}
    />
    <Latex3D latex={'V^{\\bot}'} position={ve_ortho} color={PrimeColor.blue} />

    <Angle3D vs={[new Vector3(0, 5, 0), new Vector3(3, 0, -3)]} size={0.4} />
  {/snippet}
</Canvas2D>
