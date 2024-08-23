<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import Arc2D from '$lib/d3/Arc2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { VECTOR_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const controls = Controls.addSlider(
    0.5,
    0,
    Math.PI,
    0.1,
    PrimeColor.cyan,
    'Angle L_1',
    (v) => (v / Math.PI).toFixed(2) + 'π'
  ).addSlider(
    0.4,
    0,
    Math.PI * 0.75,
    0.1,
    PrimeColor.blue,
    'Angle L_2',
    (v) => (v / Math.PI).toFixed(2) + 'π'
  );

  const draggables = [
    new Draggable(new Vector2(-3, -1), PrimeColor.raspberry, 'v', Draggable.snapToGrid)
  ];
  const v = $derived(draggables[0].value);

  const dir_L1 = $derived(new Vector2(1, 0).rotateAround(new Vector2(0, 0), controls[0]));
  const dir_L2 = $derived(dir_L1.clone().rotateAround(new Vector2(0, 0), controls[1]));

  function getOrthProjection(L: Vector2, p: Vector2) {
    return L.clone().multiplyScalar(L.clone().dot(p) / L.clone().dot(L));
  }

  const formulas = $derived.by(() => {
    const phiDiv2 = controls[0] / Math.PI;
    const thetaDiv2 = controls[1] / Math.PI;

    const f1 = new Formula('\\phi / 2 = \\$\\pi', phiDiv2.toFixed(2), PrimeColor.cyan);
    const f2 = new Formula('\\theta / 2 = \\$\\pi', thetaDiv2.toFixed(2), PrimeColor.blue);

    return new Formulas(f1, f2);
  });

  let T_L1: Vector2 = $derived.by(() => {
    const L1_proj = getOrthProjection(dir_L1, v);
    return L1_proj.clone().add(L1_proj.clone().sub(v));
  });
  let T_L2: Vector2 = $derived.by(() => {
    const L2_proj = getOrthProjection(dir_L2, T_L1);
    return L2_proj.clone().add(L2_proj.clone().sub(T_L1));
  });
</script>

<Canvas2D {draggables} {formulas} {controls}>
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
  <Arc2D points={[new Vector2(1, 0), dir_L1]} distance={1.2} />
  <Latex2D
    latex={'\\phi / 2'}
    position={dir_L1.clone().add(new Vector2(1, 0)).normalize().multiplyScalar(1.5)}
  />

  <Arc2D points={[dir_L1, dir_L2]} distance={1.5} />
  <Latex2D
    latex={'\\theta / 2'}
    position={dir_L2.clone().add(dir_L1).normalize().multiplyScalar(1.5)}
  />

  <!-- V -->
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

  <Angle2D
    startAngle={v.angle()}
    endAngle={v.angle() + 2 * controls[1]}
    distance={1}
    color={PrimeColor.darkGreen}
  />
</Canvas2D>
