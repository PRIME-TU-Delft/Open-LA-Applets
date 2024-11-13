<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import SmallestArc2D from '$lib/d3/SmallestArc2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const draggables = [
    new Draggable(new Vector2(-3, 4), PrimeColor.darkGreen, 'v', Draggable.snapToGrid)
  ];

  const v = new Vector2(3, 1);
  const w = $derived(draggables[0].position);

  const formulas = $derived.by(() => {
    const ortho = w.clone().dot(v.clone()) / (w.length() * v.length());

    const f1 = new Formula(
      '\\frac{\\mathbf{v} \\cdot \\mathbf{w}}{||\\mathbf{v}|| \\space ||\\mathbf{w}||} = \\$1'
    ).addAutoParam(round(ortho), PrimeColor.darkGreen);

    const f2 = new Formula('\\varphi = \\$1 \\pi').addAutoParam(
      round(v.angleTo(w) / Math.PI),
      PrimeColor.darkGreen
    );
    return [f1, f2];
  });
</script>

<Canvas2D showAxisNumbers={false} {draggables} {formulas}>
  <!-- L and v -->
  <InfiniteLine2D direction={v} color={PrimeColor.cyan} />
  <InfiniteLine2D
    direction={new Vector2(1, -3)}
    color={PrimeColor.black + PrimeColor.opacity(0.5)}
    isDashed
  />

  <Latex2D
    latex={'\\mathcal{L}'}
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
  <Latex2D
    latex={'\\mathbf{w}'}
    position={w.clone()}
    extend={0.25}
    offset={new Vector2(-0.25, 0.25)}
    color={PrimeColor.darkGreen}
  />

  <!-- LABELS -->
  <!-- first quatrand -->
  <Latex2D
    latex={'0 \\lt \\varphi \\lt \\frac{\\pi}{2}'}
    position={new Vector2(2, 3)}
    offset={new Vector2(0, 0.1)}
    color={PrimeColor.black}
    fontSize={0.75}
  />
  <!-- second quatrand -->
  <Latex2D
    latex={'\\frac{\\pi}{2} \\lt \\varphi \\lt \\pi'}
    position={new Vector2(-3, 2)}
    offset={new Vector2(0, 0.1)}
    color={PrimeColor.black}
    fontSize={0.75}
  />

  <!-- third quatrand -->
  <Latex2D
    latex={'\\frac{\\pi}{2} \\lt \\varphi \\lt \\pi'}
    position={new Vector2(-3, -2.5)}
    offset={new Vector2(0, 0.1)}
    color={PrimeColor.black}
    fontSize={0.75}
  />

  <!-- fourth quatrand -->
  <Latex2D
    latex={'0 \\lt \\varphi \\lt \\frac{\\pi}{2}'}
    position={new Vector2(2, -1.5)}
    offset={new Vector2(0, 0.1)}
    color={PrimeColor.black}
    fontSize={0.75}
  />

  <!-- ARC -->
  <SmallestArc2D points={[w, v]} distance={1.5}>
    {#snippet label(position: Vector2)}
      <Latex2D
        latex={'\\varphi'}
        {position}
        offset={new Vector2(0, 0.1)}
        extend={0.1}
        color={PrimeColor.black}
      />
    {/snippet}
  </SmallestArc2D>
</Canvas2D>
