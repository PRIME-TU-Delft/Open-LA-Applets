<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T, useFrame } from '@threlte/core';
  import { DoubleSide, OrthographicCamera, Vector3 } from 'three';
  import Latex3D from './Latex.svelte';
  import Line from './Line.svelte';

  export let showNumbers = false;
  export let hideTicks = false;
  export let axisLength = 10;
  export let axisSpacing = 2;
  export let responsiveSpacing = true;
  export let floor = false;
  export let hideOrigin = false;

  let spacing = axisSpacing;

  $: axisInterval = Math.floor(axisLength / (axisSpacing == 0 ? 1 : axisSpacing));
  $: indicators = new Array(axisInterval * 2 + 1)
    .fill(0)
    .map((_, i) => (i - axisInterval) * spacing); // range -axisLength to including axisLength
  $: labeledIndicators = indicators.filter((x) => x != 0);

  $: indicatorMin = indicators[0];
  $: indicatorMax = indicators[indicators.length - 1];

  const tickSizes = [0.25, 0.125]; // Ortogonal lenth of tick

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

  useFrame(({ camera }) => {
    const cam = camera.current as OrthographicCamera;
    if (responsiveSpacing && cam) {
      spacing = 3 / (1 + Math.floor(cam.zoom / 50));
    } else {
      spacing = axisSpacing;
    }
  });
</script>

<!-- Main axis lines -->
<!-- x -->
<Line
  color={PrimeColor.black}
  points={[new Vector3(indicatorMin, 0, 0), new Vector3(indicatorMax, 0, 0)]}
/>
<!-- z -->
<Line
  color={PrimeColor.black}
  points={[new Vector3(0, indicatorMin, 0), new Vector3(0, indicatorMax, 0)]}
/>
<!-- y -->
<Line
  color={PrimeColor.black}
  points={[new Vector3(0, 0, indicatorMin), new Vector3(0, 0, indicatorMax)]}
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
    {@const indicatorFixed = indicator.toFixed(2).replace('.00', '')}
    <!-- Y -->
    <Latex3D
      latex={indicatorFixed.toString()}
      position={new Vector3(indicator, 0, -0.35)}
      offset={0}
      size={0.75}
    />
    <!-- Z -->
    <Latex3D
      latex={indicatorFixed.toString()}
      position={new Vector3(0, indicator, -0.35)}
      offset={0}
      size={0.75}
    />
    <!-- X -->
    <Latex3D
      latex={indicatorFixed.toString()}
      position={new Vector3(-0.35, 0, indicator)}
      offset={0}
      size={0.75}
    />
  {/each}
{/if}

<!-- x, y, z labels -->
<Latex3D position={new Vector3(0, 0, indicatorMin - 0.3)} latex="-x" />
<Latex3D position={new Vector3(indicatorMin - 0.3, 0, 0)} latex="-y" />
<Latex3D position={new Vector3(0, indicatorMin - 0.3, 0)} latex="-z" />

<Latex3D position={new Vector3(0, 0, indicatorMax + 0.3)} latex="x" />
<Latex3D position={new Vector3(indicatorMax + 0.3, 0, 0)} latex="y" />
<Latex3D position={new Vector3(0, indicatorMax + 0.3, 0)} latex="z" />

{#if floor}
  <T.Mesh receiveShadow position.y={-0.1} rotation.x={-90 * (Math.PI / 180)}>
    <T.MeshStandardMaterial side={DoubleSide} color="black" opacity={0.1} transparent />
    <T.CircleGeometry args={[axisLength, 64]} />
  </T.Mesh>
{/if}

{#if !hideOrigin}
  <Latex3D latex={'O'} position={new Vector3(-0.3, -0.3, 0)} />
{/if}
