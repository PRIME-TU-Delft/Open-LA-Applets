<script lang="ts">
  import { T } from '@threlte/core';
  import { DoubleSide, Vector3 } from 'three';

  import { PrimeColor } from 'utils/PrimeColors';
  import Label from './Label.svelte';
  import Latex3D from './Latex.svelte';
  import Line from './Line.svelte';

  export let showNumbers = false;
  export let hideTicks = false;
  export let axisLength = 10;
  export let axisSpacing = 1;
  export let floor = false;

  $: axisInterval = Math.floor(axisLength / axisSpacing);
  $: indicators = new Array(axisInterval * 2 + 1)
    .fill(0)
    .map((_, i) => (i - axisInterval) * axisSpacing); // range -axisLength to including axisLength
  $: labeledIndicators = indicators.filter((x) => x != 0);

  $: indicatorMin = indicators[0];
  $: indicatorMax = indicators[indicators.length - 1];

  const tickSizes = [0.25, 0.125]; // Ortogonal lenth of tick
  const axisLabelOpacity = 0.4;

  function getPoints(indicator: number, size: number, axis = 0): [Vector3, Vector3] {
    let from = new Vector3(indicator, 0, size);
    let to = new Vector3(indicator, 0, -size);

    if (axis == 1) {
      from.set(0, indicator, size);
      to.set(0, indicator, -size);
    }

    if (axis == 2) {
      from.set(size, 0, indicator);
      to.set(-size, 0, indicator);
    }

    return [from, to];
  }
</script>

<!-- Main axis lines -->
<Line
  color={PrimeColor.black}
  points={[new Vector3(-1 * axisLength, 0, 0), new Vector3(axisLength, 0, 0)]}
/>
<Line
  color={PrimeColor.black}
  points={[new Vector3(0, -1 * axisLength, 0), new Vector3(0, axisLength, 0)]}
/>
<Line
  color={PrimeColor.black}
  points={[new Vector3(0, 0, -1 * axisLength), new Vector3(0, 0, axisLength)]}
/>

<!-- Tick indicators -->
{#if !hideTicks}
  {#each indicators as indicator}
    <Line color={PrimeColor.black} points={getPoints(indicator, tickSizes[1])} />
    <Line color={PrimeColor.black} points={getPoints(indicator, tickSizes[1], 1)} />
    <Line color={PrimeColor.black} points={getPoints(indicator, tickSizes[1], 2)} />
  {/each}
{/if}

<!-- Number indicators -->
{#if showNumbers}
  {#each labeledIndicators as indicator}
    <Label position={new Vector3(indicator, 0.1, -0.15)} opacity={axisLabelOpacity}>
      {indicator}
    </Label>
    <Label position={new Vector3(0, indicator, -0.15)} opacity={axisLabelOpacity}>
      {indicator}
    </Label>
    <Label position={new Vector3(-0.15, 0.1, indicator)} opacity={axisLabelOpacity}>
      {indicator}
    </Label>
  {/each}
{/if}

<Latex3D position={new Vector3(0, 0, indicatorMin)} latex="x" />
<Latex3D position={new Vector3(indicatorMin, 0, 0)} latex="y" />
<Latex3D position={new Vector3(0, indicatorMin, 0)} latex="z" />

<Latex3D position={new Vector3(0, 0, indicatorMax)} latex="x" />
<Latex3D position={new Vector3(indicatorMax, 0, 0)} latex="y" />
<Latex3D position={new Vector3(0, indicatorMax, 0)} latex="z" />

{#if floor}
  <T.Mesh receiveShadow position.y={-0.1} rotation.x={-90 * (Math.PI / 180)}>
    <T.MeshStandardMaterial side={DoubleSide} color="black" opacity={0.1} transparent />
    <T.CircleGeometry args={[axisLength, 64]} />
  </T.Mesh>
{/if}
