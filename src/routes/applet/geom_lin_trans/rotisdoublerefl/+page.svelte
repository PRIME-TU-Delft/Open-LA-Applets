<script lang="ts">
  import { Canvas2D, Draggable2D, InfiniteLine2D, Latex2D, Vector2D } from '$lib/d3-components';
  import Arc from '$lib/d3-components/Arc.svelte';
  import { VECTOR_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let dir_La = new Vector2(3, 2);
  let dir_Lb = new Vector2(1, 3);
  let v = new Vector2(-3, -1);

  $: angle_a = dir_La.angle();
  $: angle_b = dir_Lb.angle();

  $: dir_L1 = angle_a < angle_b ? dir_La : dir_Lb;
  $: dir_L2 = angle_a < angle_b ? dir_Lb : dir_La;

  $: angle_1 = Math.min(angle_a, angle_b);
  $: angle_2 = Math.max(angle_a, angle_b);

  function getFormulas(angle_1: number, angle_2: number) {
    const phiDiv2 = angle_1 / Math.PI;
    const thetaDiv2 = angle_2 / Math.PI - phiDiv2;

    const f1 = new Formula('\\phi / 2 = \\$\\pi', phiDiv2.toFixed(2), PrimeColor.cyan);
    const f2 = new Formula('\\theta / 2 = \\$\\pi', thetaDiv2.toFixed(2), PrimeColor.blue);

    return new Formulas(f1, f2);
  }

  $: formulas = getFormulas(angle_1, angle_2);
</script>

<Canvas2D {formulas}>
  <!-- La & Lb draggables -->
  <Draggable2D
    id="dir_La"
    bind:position={dir_La}
    color={angle_a < angle_b ? PrimeColor.cyan : PrimeColor.blue}
  />
  <Draggable2D
    id="dir_Lb"
    bind:position={dir_Lb}
    color={angle_a < angle_b ? PrimeColor.blue : PrimeColor.cyan}
  />

  <!-- V -->
  <Draggable2D id="v" snap bind:position={v} color={PrimeColor.raspberry} />
  <Latex2D latex={'\\mathbf{v}'} position={v} extend={0.5} color={PrimeColor.raspberry} />
  <Vector2D
    radius={VECTOR_WIDTH / 2}
    direction={v}
    length={v.length()}
    isDashed
    color={PrimeColor.black}
  />

  <!-- L1 -->
  <InfiniteLine2D direction={dir_L1} color={PrimeColor.cyan} />
  <Latex2D
    latex={'\\mathcal{L_1}'}
    position={dir_L1}
    offset={new Vector2(0, -0.25)}
    color={PrimeColor.cyan}
  />

  <!-- L2 -->
  <InfiniteLine2D direction={dir_L2} color={PrimeColor.blue} />
  <Latex2D
    latex={'\\mathcal{L_2}'}
    position={dir_L2}
    offset={new Vector2(-0.25, 0.5)}
    color={PrimeColor.blue}
  />

  <!-- ARCS -->
  <Arc points={[new Vector2(1, 0), dir_L1]} distance={1.2} />
  <Latex2D
    latex={'\\theta / 2'}
    position={dir_L1.clone().add(new Vector2(1, 0)).normalize().multiplyScalar(1.5)}
  />

  <Arc points={[dir_L1, dir_L2]} distance={1.5} />
  <Latex2D
    latex={'\\theta / 2'}
    position={dir_L2.clone().add(dir_L1).normalize().multiplyScalar(1.5)}
  />
</Canvas2D>
