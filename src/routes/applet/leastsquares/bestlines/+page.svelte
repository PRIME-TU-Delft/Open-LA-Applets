<script lang="ts">
  import {
    Canvas2D,
    Draggable2D,
    InfiniteLine2D,
    Latex2D,
    Point2D,
    Vector2D,
    RightAngle
  } from '$lib/d3-components';
  import { orthogonalProjectionWithOffset } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Matrix3, Vector2 } from 'three';

  const ps = [
    new Vector2(1, 3),
    new Vector2(2, 1),
    new Vector2(3, 3),
    new Vector2(4, 7),
    new Vector2(5, 5)
  ] as const;

  const m = new Matrix3();
  m.set(0, 1, 0, 1, 0, 0, 0, 0, 1);

  let dir_L_1 = new Vector2(-2, 1);
  let dir_L_2 = new Vector2(7, 2);
  $: dir_L = dir_L_1.clone().sub(dir_L_2);

  $: u_ts = ps.map((p) => {
    const pt = orthogonalProjectionWithOffset(p, dir_L_1, dir_L);
    const dist = p.clone().sub(pt).length();
    return { p, pt, dist };
  });
</script>

<Canvas2D cameraPosition={new Vector2(3, 3)}>
  <!-- Line L -->
  <Draggable2D id="dir_L_1" bind:position={dir_L_1} color={PrimeColor.cyan} />
  <Draggable2D id="dir_L_2" bind:position={dir_L_2} color={PrimeColor.cyan} />
  <InfiniteLine2D
    origin={dir_L_1}
    direction={dir_L_1.clone().sub(dir_L_2)}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex={'\\mathcal{l}: y = ax + b'}
    position={dir_L}
    offset={new Vector2(-0.25, 0.28)}
    color={PrimeColor.cyan}
  />

  {#each u_ts as pt, index}
    <!-- distances -->
    <Vector2D
      origin={pt.p}
      direction={pt.pt.clone().sub(pt.p)}
      length={pt.p.clone().sub(pt.pt).length()}
      color={PrimeColor.raspberry}
      hideHead
    />
    <Latex2D
      position={pt.p.clone().sub(pt.pt).multiplyScalar(0.5).add(pt.pt)}
      latex={pt.dist.toLocaleString()}
    />

    <!-- u_n -->
    <Point2D position={pt.p} color={PrimeColor.orange} />
    <Latex2D
      latex={`P_${index + 1}`}
      position={pt.p}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.orange}
    />
    <RightAngle origin={pt.pt} vs={[dir_L, pt.p.clone().sub(pt.pt)]} />
  {/each}
</Canvas2D>
