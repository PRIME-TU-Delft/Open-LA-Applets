<script lang="ts">
  import { RightAngle, Canvas2D, Vector2D, Latex2D } from '$lib/d3-components';

  import { Vector2, Vector3 } from 'three';
  import {
    Axis3D,
    Canvas3D,
    Latex3D,
    Vector3D,
    PlaneFromNormal,
    Point3D
  } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Vector from '$lib/d3-components/Vector.svelte';

  let V = new Vector3(0, 0, 0);
  const n0 = new Vector3(0, 1, 0);

  let w = new Vector3(0, 4, 0);

  let proj_v = new Vector3(3, 0, 1.5);

  let v = new Vector3(3, 4, 1.5);
</script>

<Canvas3D cameraPosition={new Vector3(10, 10, 17)} zoom={50} title="Name to be inserted">
  <!-- v -->
  <Vector3D direction={v} length={v.length()} color={PrimeColor.ultramarine} />
  <Latex3D latex={'\\mathbf{v}'} position={v} color={PrimeColor.ultramarine} />

  <!-- w -->
  <Vector3D direction={w} length={w.length()} color={PrimeColor.yellow} />
  <Latex3D latex={'\\mathbf{w}'} position={w} color={PrimeColor.yellow} />

  <!-- proj_v -->
  <Vector3D direction={proj_v} length={proj_v.length()} color={PrimeColor.red} />
  <Latex3D
    latex={'Proj_V(\\mathbf{v})'}
    position={proj_v.clone().add(new Vector3(0.2, 0, 0.2))}
    color={PrimeColor.red}
  />

  <!-- Dotted lines v and ProjV(v) -->
  <Vector3D
    origin={v}
    direction={proj_v.clone().sub(v)}
    length={proj_v.clone().sub(v).length()}
    color={PrimeColor.black}
    striped
  />

  <!-- Dotted lines v and w -->
  <Vector3D
    origin={v}
    direction={w.clone().sub(v)}
    length={w.clone().sub(v).length()}
    color={PrimeColor.black}
    striped
  />

  <!-- V -->
  <PlaneFromNormal position={V} normal={n0} color={PrimeColor.green} />
  <Latex3D latex={'V'} position={new Vector3(5.3, 0, 5.4)} color={PrimeColor.green} />
</Canvas3D>
