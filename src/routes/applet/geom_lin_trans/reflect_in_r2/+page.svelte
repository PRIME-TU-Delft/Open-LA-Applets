<script lang="ts">
  import { Canvas2D, Draggable2D, Latex2D, Line2D, Point2D, Vector2D } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Matrix3, Vector2 } from 'three';

  const us = [
    new Vector2(2, 3.5),
    new Vector2(1, -2),
    new Vector2(-2, -1),
    new Vector2(2, 0)
  ] as const;

  const m = new Matrix3();
  m.set(0, 1, 0, 1, 0, 0, 0, 0, 1);

  let dir_L = new Vector2(2, 2);
  $: start_L = dir_L.clone().multiplyScalar(-10);

  function getOrthProjection(L: Vector2, p: Vector2) {
    return L.clone().multiplyScalar(L.clone().dot(p) / L.clone().dot(L));
  }

  $: u_ts = us.map((u) => {
    const proj = getOrthProjection(dir_L, u);
    const ut = proj.clone().add(proj.clone().sub(u));
    return { u, ut };
  });
</script>

<Canvas2D>
  <!-- Line L -->
  <Draggable2D id="dir_L" bind:position={dir_L} color={PrimeColor.cyan} />
  <Line2D start={start_L} end={start_L.clone().multiplyScalar(-1)} color={PrimeColor.cyan} />
  <Latex2D
    latex={'\\mathcal{L}'}
    position={dir_L}
    offset={new Vector2(-0.25, 0.28)}
    color={PrimeColor.cyan}
  />

  {#each u_ts as ut, index}
    <Vector2D
      origin={ut.u}
      direction={ut.ut.clone().sub(ut.u)}
      length={ut.u.clone().sub(ut.ut).length()}
      color={PrimeColor.darkGreen}
      isDashed
    />

    <!-- u_n -->
    <Point2D position={ut.u} color={PrimeColor.raspberry} />
    <Latex2D
      latex={`\\mathbf{u}_${index + 1}`}
      position={ut.u}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.raspberry}
    />

    <Point2D position={ut.ut} color={PrimeColor.blue} isSquare />
    <Latex2D
      latex={`R(\\mathbf{u}_${index + 1})`}
      position={ut.ut}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.blue}
    />
  {/each}
</Canvas2D>
