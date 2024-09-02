<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Polygon2D from '$lib/d3/Polygon2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getDraggables, getSplitDraggables, values } from './draggables';

  const controls = Controls.addSlider(1.5, -5, 5, 0.5, PrimeColor.raspberry, 'c', (x) =>
    round(x, 1).toString()
  ).addDropdown('', values, PrimeColor.yellow);

  const draggables = $derived(getDraggables(controls[1]));

  const splitDraggables = $derived(getSplitDraggables(controls[1]));
</script>

<Canvas2D {controls} {draggables} splitCanvas2DProps={{ draggables: splitDraggables }}>
  {@const sum = draggables[0].value.clone().add(draggables[1].value)}

  {@render subspace()}

  <Point2D position={sum} color={PrimeColor.cyan} />
  <Vector2D direction={sum} length={sum.length()} color={PrimeColor.cyan} />
  <Latex2D
    position={sum}
    color={PrimeColor.cyan + PrimeColor.opacity(0.7)}
    latex={`\\mathbf{u} + \\mathbf{v}`}
  />

  <Vector2D
    direction={draggables[0].value}
    length={draggables[0].value.length()}
    color={PrimeColor.darkGreen + PrimeColor.opacity(0.7)}
  />
  <Latex2D position={draggables[0].value} color={PrimeColor.darkGreen} latex={`\\mathbf{u}`} />
  <Vector2D
    direction={draggables[1].value}
    length={draggables[1].value.length()}
    color={PrimeColor.orange + PrimeColor.opacity(0.7)}
  />
  <Latex2D position={draggables[1].value} color={PrimeColor.orange} latex={`\\mathbf{v}`} />

  {#snippet splitCanvas2DChildren()}
    {@const prod = splitDraggables[0].value.clone().multiplyScalar(controls[0])}

    {@render subspace()}

    <Point2D position={prod} color={PrimeColor.raspberry} />
    <Vector2D direction={prod} length={prod.length()} color={PrimeColor.raspberry} />
    <Latex2D position={prod} color={PrimeColor.raspberry} latex={`c \\cdot \\mathbf{u}`} />

    <Vector2D
      direction={splitDraggables[0].value}
      length={splitDraggables[0].value.length()}
      color={PrimeColor.darkGreen}
    />
    <Latex2D
      position={splitDraggables[0].value}
      color={PrimeColor.darkGreen}
      latex={`\\mathbf{u}`}
    />
  {/snippet}
</Canvas2D>

{#snippet subspace()}
  {#if controls[1] == 'Affine Line'}
    <InfiniteLine2D direction={new Vector2(1, 1)} color={PrimeColor.yellow} />
    <Latex2D position={new Vector2(-1, -1)} color={PrimeColor.yellow} latex={`\\mathcal{L}`} />
  {:else if controls[1] == 'Disc'}
    <circle cx={0} cy={0} r={2.5} fill={PrimeColor.yellow} opacity="0.2" />
    <Latex2D position={new Vector2(-1, -1)} color={PrimeColor.yellow} latex={`\\mathcal{A}`} />
  {:else if controls[1] == 'Two axes'}
    <InfiniteLine2D direction={new Vector2(1, 0)} color={PrimeColor.yellow} />
    <InfiniteLine2D direction={new Vector2(0, 1)} color={PrimeColor.yellow} />
    <Latex2D position={new Vector2(-1, -1)} color={PrimeColor.yellow} latex={`\\mathcal{L}`} />
  {:else if controls[1] == 'First quadrant'}
    <rect x={0} y={0} width={30} height={30} fill={PrimeColor.yellow} opacity="0.2" />
    <Latex2D position={new Vector2(4, 0.5)} color={PrimeColor.yellow} latex={`\\mathcal{A}`} />
  {:else if controls[1] == 'Two-sided cone'}
    <Polygon2D
      points={[
        new Vector2(0, 0),
        new Vector2(0, 30),
        new Vector2(30, 30),
        new Vector2(-30, -30),
        new Vector2(0, -30)
      ]}
      color={PrimeColor.yellow + PrimeColor.opacity(0.2)}
    />
    <Latex2D position={new Vector2(0.5, -1)} color={PrimeColor.yellow} latex={`\\mathcal{A}`} />
  {/if}
{/snippet}
