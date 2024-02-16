<script lang="ts">
  import { RightAngle, Canvas2D, Vector2D, Latex2D } from '$lib/d3-components';

  import { Vector2, Vector3 } from 'three';
  import {
    Angle3D,
    Axis3D,
    Canvas3D,
    Latex3D,
    Vector3D,
    PlaneFromNormal
  } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  let v = new Vector2(3, -3);
  let v_ortho = new Vector2(3, 3);

  let ve = new Vector3(0, 0, 0);
  let ve_ortho = new Vector3(0, 7, 0);

  const n0 = new Vector3(0, 1, 0);
</script>

<Canvas2D
  cameraPosition={new Vector3(10, 10, 13)}
  zoom={1.5}
  zoom3d={50}
  title="The orthogonal complement of a line (left) and a plane (right)"
>
  <!-- v -->
  <Vector2D
    direction={v}
    length={v.length() * 2}
    color={PrimeColor.darkGreen}
    origin={v.clone().multiplyScalar(-1)}
  >
    <Latex2D
      latex={'V'}
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
  <RightAngle vs={[v, v_ortho]} lineWidth={0.03} />

  <svelte:fragment slot="splitCanvas3d">
    <!-- v -->
    <PlaneFromNormal position={ve} normal={n0} color={PrimeColor.darkGreen} />
    <Latex3D latex={'V'} position={new Vector3(5.1, 0, 5.2)} color={PrimeColor.darkGreen} />

    <!-- v_ortho -->
    <Vector3D
      direction={ve_ortho}
      length={ve_ortho.length() * 2}
      color={PrimeColor.blue}
      origin={ve_ortho.clone().multiplyScalar(-1)}
    />
    <Latex3D latex={'V^{\\bot}'} position={ve_ortho} color={PrimeColor.blue} />

    <Angle3D vs={[new Vector3(0, 5, 0), new Vector3(3, 0, -3)]} size={0.4} />
  </svelte:fragment>
</Canvas2D>
