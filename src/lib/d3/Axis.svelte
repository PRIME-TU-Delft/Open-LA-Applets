<script lang="ts" module>
  export type AxisProps = {
    length?: number;
    showOrigin?: boolean;
    showAxisNumbersX?: boolean;
    showAxisNumbersY?: boolean;
    showGridLinesX?: boolean;
    showGridLinesY?: boolean;
    showAxisX?: boolean;
    showAxisY?: boolean;
    logarithmicX?: boolean;
    logarithmicY?: boolean;
    skipX?: number;
    skipY?: number;
    additionalTicksX?: number[];
    additionalTicksY?: number[];
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Latex2D from './Latex2D.svelte';
  import { getContext, setContext } from 'svelte';

  let {
    length = GRID_SIZE_2D,
    showOrigin = true,
    showAxisNumbersX = true,
    showAxisNumbersY = true,
    logarithmicX = false,
    logarithmicY = false,
    skipX = 0,
    skipY = 0,
    showGridLinesX = true,
    showGridLinesY = true,
    showAxisX = true,
    showAxisY = true,
    additionalTicksX = [],
    additionalTicksY = []
  }: AxisProps = $props();

  const scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const scaleX = scale2D?.x ?? 1;
  const scaleY = scale2D?.y ?? 1;

  // Convert additionalTicks from display-space to world-space
  const worldAdditionalTicksX = $derived(additionalTicksX.map((tick) => tick * scaleX));
  const worldAdditionalTicksY = $derived(additionalTicksY.map((tick) => tick * scaleY));

  // Set scale2D context to {x:1, y:1} to prevent double-scaling of internal labels
  setContext('scale2D', { x: 1, y: 1 });

  // Generate indeces for the grid lines from -length to length including 0
  let axisIndicesX = $derived([...Array(length + 1).keys()].flatMap((a) => [-a, a]));
  let axisIndicesY = $derived([...Array(length + 1).keys()].flatMap((a) => [-a, a]));

  function stokeWidth(index: number, logarithmic: boolean) {
    if (logarithmic) return 0.005;

    if (index % 10 == 0) return 0.02;
    if (index % 5 == 0) return 0.01;
    return 0.005;
  }

  function getTickText(index: number, axis: 'x' | 'y') {
    if ((axis == 'x' && !logarithmicX) || (axis == 'y' && !logarithmicY)) {
      return index.toLocaleString();
    }

    return `10^{${index}}`;
  }

  function showSkippedTick(index: number, skip: number, additionalTicks: number[]) {
    if (index === 0 && skipX != -1) return true;
    if (additionalTicks.includes(index)) return true;
    return Math.abs(index) % (skip + 1) === 0;
  }

  let yAxisTextX = $derived(logarithmicY ? 0.2 : -0.2);
</script>

<g>
  {#each axisIndicesX as index, idx (idx)}
    <!-- Grid Lines -->
    {#if index != 0 && showGridLinesX && showSkippedTick(index, skipX, additionalTicksX)}
      <line
        x1={index}
        y1={-length}
        x2={index}
        y2={length}
        stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(index, logarithmicX)}
      />
    {/if}
    {#if index == 0 && showAxisY}
      <!-- Y axis -->
      <line
        x1={index}
        y1={-length}
        x2={index}
        y2={length}
        stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(index, logarithmicX)}
      />
    {/if}

    <!-- Tick marks -->
    {#if showSkippedTick(index, skipX, additionalTicksX)}
      <line x1={index} y1={-0.1} x2={index} y2={0.1} stroke="black" stroke-width={0.02} />
    {/if}

    {#if index != 0 && showAxisNumbersX && showSkippedTick(index, skipX, additionalTicksX)}
      <!-- X axis number labels -->
      {#if index <= length && index >= -length}
        <Latex2D
          latex={getTickText(index / scaleX, 'x')}
          position={new Vector2(index, -0.15)}
          alignX="center"
        />
      {/if}
    {/if}
  {/each}

  {#each additionalTicksX as index, idx (idx)}
    {@const worldIndex = worldAdditionalTicksX[idx]}
    <!-- Grid Lines -->
    {#if worldIndex != 0 && showGridLinesX && showSkippedTick(worldIndex, skipX, worldAdditionalTicksX)}
      <line
        x1={worldIndex}
        y1={-length}
        x2={worldIndex}
        y2={length}
        stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(worldIndex, logarithmicX)}
      />
    {/if}
    {#if worldIndex == 0 && showAxisY}
      <!-- Y axis -->
      <line
        x1={worldIndex}
        y1={-length}
        x2={worldIndex}
        y2={length}
        stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(worldIndex, logarithmicX)}
      />
    {/if}

    <!-- Tick marks -->
    {#if showSkippedTick(worldIndex, skipX, worldAdditionalTicksX)}
      <line x1={worldIndex} y1={-0.1} x2={worldIndex} y2={0.1} stroke="black" stroke-width={0.02} />
    {/if}

    {#if worldIndex != 0 && showAxisNumbersX && showSkippedTick(worldIndex, skipX, worldAdditionalTicksX)}
      <!-- X axis number labels -->
      {#if worldIndex <= length && worldIndex >= -length}
        <Latex2D
          latex={getTickText(index, 'x')}
          position={new Vector2(worldIndex, -0.15)}
          alignX="center"
        />
      {/if}
    {/if}
  {/each}

  {#each axisIndicesY as index, idx (idx)}
    <!-- Grid Lines -->
    {#if index != 0 && showGridLinesY && showSkippedTick(index, skipY, additionalTicksY)}
      <line
        x1={-length}
        y1={index}
        x2={length}
        y2={index}
        stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(index, logarithmicY)}
      />
    {/if}
    {#if index == 0 && showAxisX}
      <!-- X axis -->
      <line
        x1={-length}
        y1={index}
        x2={length}
        y2={index}
        stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(index, logarithmicY)}
      />
    {/if}

    <!-- Tick marks -->
    {#if showSkippedTick(index, skipY, additionalTicksY)}
      <line x1={-0.1} y1={index} x2={0.1} y2={index} stroke="black" stroke-width={0.02} />
    {/if}

    {#if index != 0 && showAxisNumbersY && showSkippedTick(index, skipY, additionalTicksY)}
      <!-- Y axis number labels -->
      {#if index <= length && index >= -length}
        <Latex2D
          latex={getTickText(index / scaleY, 'y')}
          position={new Vector2(yAxisTextX, index)}
          alignX={logarithmicY ? 'left' : 'right'}
          alignY="center"
        />
      {/if}
    {/if}
  {/each}

  {#each additionalTicksY as index, idx (idx)}
    {@const worldIndex = worldAdditionalTicksY[idx]}
    <!-- Grid Lines -->
    {#if worldIndex != 0 && showGridLinesY && showSkippedTick(worldIndex, skipY, worldAdditionalTicksY)}
      <line
        x1={-length}
        y1={worldIndex}
        x2={length}
        y2={worldIndex}
        stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(worldIndex, logarithmicY)}
      />
    {/if}
    {#if worldIndex == 0 && showAxisX}
      <!-- X axis -->
      <line
        x1={-length}
        y1={worldIndex}
        x2={length}
        y2={worldIndex}
        stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(worldIndex, logarithmicY)}
      />
    {/if}

    <!-- Tick marks -->
    {#if showSkippedTick(worldIndex, skipY, worldAdditionalTicksY)}
      <line x1={-0.1} y1={worldIndex} x2={0.1} y2={worldIndex} stroke="black" stroke-width={0.02} />
    {/if}

    {#if worldIndex != 0 && showAxisNumbersY && showSkippedTick(worldIndex, skipY, worldAdditionalTicksY)}
      <!-- Y axis number labels -->
      {#if worldIndex <= length && worldIndex >= -length}
        <Latex2D
          latex={getTickText(index, 'y')}
          position={new Vector2(yAxisTextX, worldIndex)}
          alignX={logarithmicY ? 'left' : 'right'}
          alignY="center"
        />
      {/if}
    {/if}
  {/each}

  <!-- Axis labels -->
  {#if showOrigin}
    <Latex2D latex="O" offset={new Vector2(-0.28, -0.11)} />
  {/if}
</g>
