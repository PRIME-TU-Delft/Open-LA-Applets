<script lang="ts">
  import {
    Canvas2D,
    Draggable2D,
    InfiniteLine2D,
    Latex2D,
    Point2D,
    Vector2D
  } from '$lib/d3-components';
  import Arc from '$lib/d3-components/Arc.svelte';
  import Angle from '$lib/d3-components/Angle.svelte';
  import { VECTOR_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let dir_La = new Vector2(3, 2);
  let dir_Lb = new Vector2(2, 3);
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

  function getOrthProjection(L: Vector2, p: Vector2) {
    return L.clone().multiplyScalar(L.clone().dot(p) / L.clone().dot(L));
  }

  $: formulas = getFormulas(angle_1, angle_2);

  let T_L1: Vector2;
  let T_L2: Vector2;

  $: {
    const L1_proj = getOrthProjection(dir_L1, v);
    T_L1 = L1_proj.clone().add(L1_proj.clone().sub(v));
  }

  $: {
    const L2_proj = getOrthProjection(dir_L2, T_L1);
    T_L2 = L2_proj.clone().add(L2_proj.clone().sub(T_L1));
  }
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
    latex={'\\phi / 2'}
    position={dir_L1.clone().add(new Vector2(1, 0)).normalize().multiplyScalar(1.5)}
  />

  <Arc points={[dir_L1, dir_L2]} distance={1.5} />
  <Latex2D
    latex={'\\theta / 2'}
    position={dir_L2.clone().add(dir_L1).normalize().multiplyScalar(1.5)}
  />

  <!-- V -->
  <Draggable2D id="v" snap bind:position={v} color={PrimeColor.raspberry} />
  <Latex2D latex={'\\mathbf{v}'} position={v} extend={0.5} color={PrimeColor.raspberry} />
  <Vector2D
    direction={v}
    length={v.length()}
    radius={VECTOR_WIDTH / 2}
    color={PrimeColor.black}
    isDashed
  />

  <!-- T_L1(V) v + angle_1 -->
  <Point2D position={T_L1} />
  <Vector2D
    origin={v}
    direction={T_L1.clone().sub(v)}
    length={T_L1.clone().sub(v).length()}
    radius={VECTOR_WIDTH / 2}
    color={PrimeColor.yellow}
    isDashed
  />
  <Latex2D
    latex={`\\color{${PrimeColor.cyan}} T_\\mathcal{L_1} (\\color{${PrimeColor.raspberry}}\\mathbf{v} \\color{${PrimeColor.cyan}})`}
    position={T_L1}
    offset={new Vector2(-0.25, 0.25)}
    extend={0.5}
  />

  <!-- T_L2(T_L1(V)) v + 2 * angle_2 -->
  <Point2D position={T_L2} />
  <Vector2D
    direction={T_L2}
    length={T_L2.length()}
    radius={VECTOR_WIDTH / 2}
    color={PrimeColor.black}
    isDashed
  />
  <Vector2D
    origin={T_L1}
    direction={T_L2.clone().sub(T_L1)}
    length={T_L2.clone().sub(T_L1).length()}
    radius={VECTOR_WIDTH / 2}
    color={PrimeColor.yellow}
    isDashed
  />
  <Latex2D
    latex={`T_{\\theta}(\\color{${PrimeColor.raspberry}}\\mathbf{v}\\color{#000}) = T_\\mathcal{L_2}( T_\\mathcal{L_1}(\\color{${PrimeColor.raspberry}}\\mathbf{v}\\color{#000}))`}
    position={T_L2}
    offset={new Vector2(-0.25, 0.2)}
    extend={0.5}
  />

  <Angle
    startAngle={v.angle()}
    endAngle={v.angle() + 2 * (angle_b - angle_a)}
    distance={1}
    color={PrimeColor.darkGreen}
  />
</Canvas2D>
