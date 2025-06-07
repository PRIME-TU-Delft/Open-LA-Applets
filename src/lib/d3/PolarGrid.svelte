<script lang="ts" module>
  export type PolarGridProps = {
    angleStep?: number;
    highlightRadii?: number[];
    showRadiiTicks?: boolean;
    showAngleTicks?: boolean;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import InfiniteLine2D from './InfiniteLine2D.svelte';
  import Circle2D from './Circle2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
  import Latex2D from './Latex2D.svelte';

  let { angleStep = 30, highlightRadii = [], showRadiiTicks = true, showAngleTicks = false }: PolarGridProps = $props();

  let lines: { [angle: number]: Vector2 } = {};

  for (let angle = 0; angle < 180; angle += angleStep) {
    let rad = (angle * Math.PI) / 180.0;

    let x = Math.cos(rad);
    let y = Math.sin(rad);

    let angle_as_rad_fraction = angle > 0 ? 180.0 / angle: 0;

    lines[angle_as_rad_fraction] = new Vector2(x, y);
  }
  console.log(lines);

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
{#each Object.entries(lines) as [angle, v]}
  <InfiniteLine2D direction={v} color={strokeColor} width={strokeWidth(5)} />

  {#if showAngleTicks && Number(angle) > 0 && Number(angle) >= 2}
    {@const position_: Vector2 = v.multiplyScalar(1.8) }
    {@const position: Vector2 = position_.add(new Vector2(0.1, 0)) }
    <Latex2D latex={`\\frac{\\pi}{${angle}}`} {position} fontSize={0.3} color={strokeColor} />

    {@const positionOpposite: Vector2 = new Vector2(position.x-0.05, -position.y+0.2) }
    <Latex2D latex={`-\\frac{\\pi}{${angle}}`} position={positionOpposite} fontSize={0.3} color={strokeColor} />

    {#if Number(angle) > 2}
      {@const positionLeft: Vector2 = new Vector2(-position.x-0.05, position.y) }
      <Latex2D latex={`\\frac{${Number(angle)-1}\\pi}{${angle}}`} position={positionLeft} fontSize={0.3} color={strokeColor} />

      {@const positionLeftOpposite: Vector2 = new Vector2(positionLeft.x-0.1, -positionLeft.y+0.25) }
      <Latex2D latex={`-\\frac{${Number(angle)-1}\\pi}{${angle}}`} position={positionLeftOpposite} fontSize={0.3} color={strokeColor} />
    {/if}
  {/if}
{/each}

<!-- Radius grid circles -->
{#each [...Array(numCircles).keys()] as radius}
  <Circle2D {radius} width={strokeWidth(radius)} color={strokeColor} />

  <!-- ticks -->
  {#if showRadiiTicks && radius > 0}
    <line x1={radius} y1={-0.1} x2={radius} y2={0.1} stroke="black" stroke-width={0.02} />
    <Latex2D latex={radius.toLocaleString()} position={new Vector2(radius - 0.01, -0.15)} />
  {/if}
{/each}
