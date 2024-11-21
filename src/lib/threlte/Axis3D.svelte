<script lang="ts" module>
  export type Axis3DProps = {
    showNumbers?: boolean;
    hideTicks?: boolean;
    axisLength?: number;
    axisSpacing?: number;
    floor?: boolean;
    hideOrigin?: boolean;
  };
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { DoubleSide, Vector3 } from 'three';
  import Latex3D from './Latex3D.svelte';
  import Line from './Line3D.svelte';

  let {
    showNumbers = false,
    hideTicks = false,
    axisLength = 10,
    axisSpacing = 2,
    floor = false,
    hideOrigin = false
  }: Axis3DProps = $props();

  const axisInterval = $derived(Math.floor(axisLength / (axisSpacing == 0 ? 1 : axisSpacing)));
  const indicators = $derived(
    new Array(axisInterval * 2 + 1).fill(0).map((_, i) => (i - axisInterval) * axisSpacing)
  ); // range -axisLength to including axisLength
  const labeledIndicators = $derived(indicators.filter((x) => x != 0));

  const indicatorMin = $derived(indicators[0]);
  const indicatorMax = $derived(indicators[indicators.length - 1]);

  const TICK_SIZES = [0.25, 0.125]; // Ortogonal lenth of tick

  /**
   * Get the points for the tick indicators
   * @param indicator - The indicator value
   * @param size - The size of the tick
   * @param axis - The axis to draw the tick
   */
  function getPoints(indicator: number, size: number, axis = 0) {
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

    return { origin: from, endPoint: to };
  }
</script>

<!-- Main axis lines -->
<!-- x -->
<Line
  color={PrimeColor.black}
  origin={new Vector3(indicatorMin, 0, 0)}
  endPoint={new Vector3(indicatorMax, 0, 0)}
  radius={0.25}
/>
<!-- z -->
<Line
  color={PrimeColor.black}
  origin={new Vector3(0, indicatorMin, 0)}
  endPoint={new Vector3(0, indicatorMax, 0)}
  radius={0.25}
/>
<!-- y -->
<Line
  color={PrimeColor.black}
  origin={new Vector3(0, 0, indicatorMin)}
  endPoint={new Vector3(0, 0, indicatorMax)}
  radius={0.25}
/>

<!-- Tick indicators -->
{#if !hideTicks}
  {#each indicators as indicator}
    <Line color={PrimeColor.black} {...getPoints(indicator, TICK_SIZES[1])} />
    <Line color={PrimeColor.black} {...getPoints(indicator, TICK_SIZES[1], 1)} />
    <Line color={PrimeColor.black} {...getPoints(indicator, TICK_SIZES[1], 2)} />
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
      fontSize={0.75}
    />
    <!-- Z -->
    <Latex3D
      latex={indicatorFixed.toString()}
      position={new Vector3(0, indicator, -0.35)}
      fontSize={0.75}
    />
    <!-- X -->
    <Latex3D
      latex={indicatorFixed.toString()}
      position={new Vector3(-0.35, 0, indicator)}
      fontSize={0.75}
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
