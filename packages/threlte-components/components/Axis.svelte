<script lang="ts">
  import { get } from 'svelte/store';
  import { Euler, Quaternion, Vector3 } from 'three';
  import { useFrame } from '@threlte/core';
  import { HTML, Text } from '@threlte/extras';

  import { PrimeColor } from 'utils/PrimeColors';
  import Line from './Line.svelte';
  import Label from './Label.svelte';
  import Equation from './Equation.svelte';

  export let showNumbers = false;
  export let hideTicks = false;
  export let axisLength = 10;
  export let axisSpacing = 1;

  let quaternion: Quaternion = new Quaternion();
  $: euler = new Euler().setFromQuaternion(quaternion);

  $: axisInterval = Math.floor(axisLength / axisSpacing);
  $: indecators = new Array(axisInterval * 2 + 1)
    .fill(0)
    .map((_, i) => (i - axisInterval) * axisSpacing); // range -axisLength to including axisLength
  $: largeIndecators = indecators.filter((x, i) => i % (axisSpacing * 2) === 0 && x !== 0); // Even minus 0 indecators
  $: smallIndecators = indecators.filter((x, i) => i % (axisSpacing * 2) === 1 && x !== 0); // Odd indecators

  $: indecatorMin = indecators[0];
  $: indecatorMax = indecators[indecators.length - 1];
  const axisFontSize = 0.2;

  const tickSizes = [0.25, 0.125]; // Ortogonal lenth of tick

  function approxEqual(a: Quaternion, b: Quaternion, eps = 0.01) {
    return (
      Math.abs(a.x - b.x) < eps &&
      Math.abs(a.y - b.y) < eps &&
      Math.abs(a.z - b.z) < eps &&
      Math.abs(a.w - b.w) < eps
    );
  }

  function getPoints(indecator: number, size: number, axis = 0): [Vector3, Vector3] {
    let from = new Vector3(indecator, 0, size);
    let to = new Vector3(indecator, 0, -size);

    if (axis == 1) {
      from.set(0, indecator, size);
      to.set(0, indecator, -size);
    }

    if (axis == 2) {
      from.set(size, 0, indecator);
      to.set(-size, 0, indecator);
    }

    return [from, to];
  }

  useFrame(({ camera }) => {
    if (!camera) return;

    const quat = get(camera).quaternion;
    if (approxEqual(quat, quaternion)) return;

    quaternion = quat.clone();
  });
</script>

<!-- Main axis lines -->
<Line
  color={PrimeColor.red}
  points={[new Vector3(-1 * axisLength, 0, 0), new Vector3(axisLength, 0, 0)]}
/>
<Line
  color={PrimeColor.green}
  points={[new Vector3(0, -1 * axisLength, 0), new Vector3(0, axisLength, 0)]}
/>
<Line
  color={PrimeColor.ultramarine}
  points={[new Vector3(0, 0, -1 * axisLength), new Vector3(0, 0, axisLength)]}
/>

<!-- Tick indecators -->
{#if !hideTicks}
  {#each largeIndecators as indecator}
    <Line color={PrimeColor.red} points={getPoints(indecator, tickSizes[0])} />
    <Line color={PrimeColor.green} points={getPoints(indecator, tickSizes[0], 1)} />
    <Line color={PrimeColor.ultramarine} points={getPoints(indecator, tickSizes[0], 2)} />
  {/each}

  {#each smallIndecators as indecator}
    <Line color={PrimeColor.red} points={getPoints(indecator, tickSizes[1])} />
    <Line color={PrimeColor.green} points={getPoints(indecator, tickSizes[1], 1)} />
    <Line color={PrimeColor.ultramarine} points={getPoints(indecator, tickSizes[1], 2)} />
  {/each}
{/if}

<!-- Number indecators -->
{#if showNumbers}
  {#each smallIndecators as indecator}
    <Label position={new Vector3(indecator, 0, 0)} opacity={0.8}>{indecator}</Label>
    <Label position={new Vector3(0, indecator, 0)} opacity={0.8}>{indecator}</Label>
    <Label position={new Vector3(0, 0, indecator)} opacity={0.8}>{indecator}</Label>
  {/each}

  <Equation position={new Vector3(0, 0, indecatorMin)} latex="-x" />
  <Equation position={new Vector3(indecatorMin, 0, 0)} latex="-y" />
  <Equation position={new Vector3(0, indecatorMin, 0)} latex="-z" />

  <Equation position={new Vector3(0, 0, indecatorMax)} latex="x" />
  <Equation position={new Vector3(indecatorMax, 0, 0)} latex="y" />
  <Equation position={new Vector3(0, indecatorMax, 0)} latex="z" />
{/if}
