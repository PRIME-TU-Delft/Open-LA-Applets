<script lang="ts" module>
  export type PolarGridProps = {
    angleStep?: number;
    highlightRadii?: number[];
    showTicks?: boolean;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import InfiniteLine2D from './InfiniteLine2D.svelte';
  import Circle2D from './Circle2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
  import Latex2D from './Latex2D.svelte';

  let { angleStep = 30, highlightRadii = [], showTicks = true }: PolarGridProps = $props();

  let lines: Vector2[] = [];

  for (let angle = 0; angle < 180; angle += angleStep) {
    let rad = (angle * Math.PI) / 180.0;

    let x = Math.cos(rad);
    let y = -Math.sin(rad);
    lines.push(new Vector2(x, y));
  }

  function strokeWidth(index: number) {
    if (highlightRadii.includes(index)) return 0.03;

    if (index % 10 == 0) return 0.02;
    if (index % 5 == 0) return 0.01;
    return 0.005;
  }

  let strokeColor = PrimeColor.black + PrimeColor.opacity(0.5);

  let numCircles = GRID_SIZE_2D;
</script>

<!--@component
@props
- angleStep: number - Step of the angled grid lines (in degrees)
- highlightRadii: number[] - List of radii distances that should be highlighted
- showTicks: boolean - Whether to show the ticks on the x-axis with radii sizes

@example
<PolarGrid angleStep={45} showTicks={false} highlightRadii={[1]} />
-->

<!-- Main lines: e1, e2 -->
<InfiniteLine2D direction={new Vector2(1, 0)} color={PrimeColor.black} width={strokeWidth(0)} />
<InfiniteLine2D direction={new Vector2(0, 1)} color={PrimeColor.black} width={strokeWidth(0)} />

<!-- Angled grid lines -->
{#each lines as v}
  <InfiniteLine2D direction={v} color={strokeColor} width={strokeWidth(5)} />
{/each}

<!-- Radius grid circles -->
{#each [...Array(numCircles).keys()] as radius}
  <Circle2D {radius} width={strokeWidth(radius)} color={strokeColor} />

  <!-- ticks -->
  {#if showTicks && radius > 0}
    <line x1={radius} y1={-0.1} x2={radius} y2={0.1} stroke="black" stroke-width={0.02} />
    <Latex2D latex={radius.toLocaleString()} position={new Vector2(radius - 0.01, -0.15)} />
  {/if}
{/each}
