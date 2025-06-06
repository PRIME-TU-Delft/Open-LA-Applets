<script lang="ts" module>
  export type PolarGridProps = {
    angleStep?: number;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import InfiniteLine2D from './InfiniteLine2D.svelte';
  import Circle2D from './Circle2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  let { angleStep = 30 }: PolarGridProps = $props();

  let lines: Vector2[] = [];

  for (let angle = 0; angle < 180; angle += angleStep) {
    let rad = (angle * Math.PI) / 180.0;

    let x = Math.cos(rad);
    let y = -Math.sin(rad);
    lines.push(new Vector2(x, y));
  }

  function strokeWidth(index: number) {
    if (index % 10 == 0) return 0.02;
    if (index % 5 == 0) return 0.01;
    return 0.005;
  }

  let strokeColor = PrimeColor.black + PrimeColor.opacity(0.5);

  let numCircles = 20;
</script>

<!--@component
@props
- angleStep: number - Step of the angled grid lines (in degrees)

@example
<PolarGrid angleStep={45} />
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
  <Circle2D
    {radius}
    width={strokeWidth(radius)}
    color={strokeColor}
  />
{/each}
