<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import Arc2D from '$lib/d3/Arc2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const draggables = [
    new Draggable(new Vector2(-3, -4), PrimeColor.darkGreen, 'v', Draggable.snapToGrid)
  ];

  const v = new Vector2(3, 1);
  const w = $derived(draggables[0].value);

  const formulas = $derived.by(() => {
    const ortho = w.clone().dot(v.clone()) / v.clone().dot(v.clone());
    const angle = (w.clone().angle() - v.clone().angle()) / Math.PI;

    const f1 = new Formula(
      '\\frac{\\mathbf{w} \\cdot \\mathbf{v}}{\\mathbf{v} \\cdot \\mathbf{v}} = \\$1'
    ).addAutoParam(round(ortho), PrimeColor.darkGreen);

    const f2 = new Formula('\\theta = \\$1 \\pi').addAutoParam(round(angle), PrimeColor.darkGreen);
    return [f1, f2];
  });
</script>

<Canvas2D showAxisNumbers={false} {draggables} {formulas}>
  <!-- L and v -->
  <InfiniteLine2D direction={v} color={PrimeColor.cyan} />
  <Latex2D
    latex={'\\mathcal{L_1}'}
    position={v.clone().normalize().multiplyScalar(4)}
    offset={new Vector2(0, -0.05)}
    color={PrimeColor.cyan}
  />

  <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} />
  <Latex2D
    latex={'\\mathbf{v}'}
    position={v.clone()}
    offset={new Vector2(0, -0.05)}
    color={PrimeColor.blue}
  />

  <!-- W -->
  <Vector2D direction={w} length={w.length()} color={PrimeColor.darkGreen} />

  <!-- ARC -->
  <Angle2D startAngle={w.angle()} endAngle={v.angle()} />
</Canvas2D>
