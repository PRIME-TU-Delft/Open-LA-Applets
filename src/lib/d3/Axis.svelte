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
    colorX?: string;
    colorY?: string;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Latex2D from './Latex2D.svelte';
  import { getProjection2D } from './Projection2D';

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
    additionalTicksY = [],
    colorX = PrimeColor.black,
    colorY = PrimeColor.black
  }: AxisProps = $props();

  const projection = getProjection2D();

  // The grid is drawn in screen space: grid index i sits at screen coordinate i.
  // Tick labels show world values. additionalTicks are given in world space.
  const screenAdditionalTicksX = $derived(
    additionalTicksX.map((tick) => projection.xToScreen(tick))
  );
  const screenAdditionalTicksY = $derived(
    additionalTicksY.map((tick) => projection.yToScreen(tick))
  );

  // Latex2D projects its position, so screen-space label spots go in as world coordinates.
  const labelPosition = (screenX: number, screenY: number) =>
    projection.toWorld(new Vector2(screenX, screenY));

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
      // Forced en-GB locale string
      return index.toLocaleString('en-GB');
      // todo: make aware of embedding page or used url in iframe
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
    {#if index != 0 && showGridLinesX && showSkippedTick(index, skipX, screenAdditionalTicksX)}
      <line
        x1={index}
        y1={-length}
        x2={index}
        y2={length}
        stroke={colorX + PrimeColor.opacity(0.5)}
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
        stroke={colorY + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(index, logarithmicX)}
      />
    {/if}

    <!-- Tick marks -->
    {#if showSkippedTick(index, skipX, screenAdditionalTicksX)}
      <line x1={index} y1={-0.1} x2={index} y2={0.1} stroke={colorX} stroke-width={0.02} />
    {/if}

    {#if index != 0 && showAxisNumbersX && showSkippedTick(index, skipX, screenAdditionalTicksX)}
      <!-- X axis number labels -->
      {#if index <= length && index >= -length}
        <Latex2D
          latex={getTickText(projection.xToWorld(index), 'x')}
          position={labelPosition(index, -0.15)}
          alignX="center"
          color={colorX}
        />
      {/if}
    {/if}
  {/each}

  {#each additionalTicksX as index, idx (idx)}
    {@const screenIndex = screenAdditionalTicksX[idx]}
    <!-- Grid Lines -->
    {#if screenIndex != 0 && showGridLinesX && showSkippedTick(screenIndex, skipX, screenAdditionalTicksX)}
      <line
        x1={screenIndex}
        y1={-length}
        x2={screenIndex}
        y2={length}
        stroke={colorX + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(screenIndex, logarithmicX)}
      />
    {/if}
    {#if screenIndex == 0 && showAxisY}
      <!-- Y axis -->
      <line
        x1={screenIndex}
        y1={-length}
        x2={screenIndex}
        y2={length}
        stroke={colorY + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(screenIndex, logarithmicX)}
      />
    {/if}

    <!-- Tick marks -->
    {#if showSkippedTick(screenIndex, skipX, screenAdditionalTicksX)}
      <line
        x1={screenIndex}
        y1={-0.1}
        x2={screenIndex}
        y2={0.1}
        stroke={colorX}
        stroke-width={0.02}
      />
    {/if}

    {#if screenIndex != 0 && showAxisNumbersX && showSkippedTick(screenIndex, skipX, screenAdditionalTicksX)}
      <!-- X axis number labels -->
      {#if screenIndex <= length && screenIndex >= -length}
        <Latex2D
          latex={getTickText(index, 'x')}
          position={labelPosition(screenIndex, -0.15)}
          alignX="center"
          color={colorX}
        />
      {/if}
    {/if}
  {/each}

  {#each axisIndicesY as index, idx (idx)}
    <!-- Grid Lines -->
    {#if index != 0 && showGridLinesY && showSkippedTick(index, skipY, screenAdditionalTicksY)}
      <line
        x1={-length}
        y1={index}
        x2={length}
        y2={index}
        stroke={colorY + PrimeColor.opacity(0.5)}
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
        stroke={colorX + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(index, logarithmicY)}
      />
    {/if}

    <!-- Tick marks -->
    {#if showSkippedTick(index, skipY, screenAdditionalTicksY)}
      <line x1={-0.1} y1={index} x2={0.1} y2={index} stroke={colorY} stroke-width={0.02} />
    {/if}

    {#if index != 0 && showAxisNumbersY && showSkippedTick(index, skipY, screenAdditionalTicksY)}
      <!-- Y axis number labels -->
      {#if index <= length && index >= -length}
        <Latex2D
          latex={getTickText(projection.yToWorld(index), 'y')}
          position={labelPosition(yAxisTextX, index)}
          alignX={logarithmicY ? 'left' : 'right'}
          alignY="center"
          color={colorY}
        />
      {/if}
    {/if}
  {/each}

  {#each additionalTicksY as index, idx (idx)}
    {@const screenIndex = screenAdditionalTicksY[idx]}
    <!-- Grid Lines -->
    {#if screenIndex != 0 && showGridLinesY && showSkippedTick(screenIndex, skipY, screenAdditionalTicksY)}
      <line
        x1={-length}
        y1={screenIndex}
        x2={length}
        y2={screenIndex}
        stroke={colorY + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(screenIndex, logarithmicY)}
      />
    {/if}
    {#if screenIndex == 0 && showAxisX}
      <!-- X axis -->
      <line
        x1={-length}
        y1={screenIndex}
        x2={length}
        y2={screenIndex}
        stroke={colorX + PrimeColor.opacity(0.5)}
        stroke-width={stokeWidth(screenIndex, logarithmicY)}
      />
    {/if}

    <!-- Tick marks -->
    {#if showSkippedTick(screenIndex, skipY, screenAdditionalTicksY)}
      <line
        x1={-0.1}
        y1={screenIndex}
        x2={0.1}
        y2={screenIndex}
        stroke={colorY}
        stroke-width={0.02}
      />
    {/if}

    {#if screenIndex != 0 && showAxisNumbersY && showSkippedTick(screenIndex, skipY, screenAdditionalTicksY)}
      <!-- Y axis number labels -->
      {#if screenIndex <= length && screenIndex >= -length}
        <Latex2D
          latex={getTickText(index, 'y')}
          position={labelPosition(yAxisTextX, screenIndex)}
          alignX={logarithmicY ? 'left' : 'right'}
          alignY="center"
          color={colorY}
        />
      {/if}
    {/if}
  {/each}

  <!-- Axis labels -->
  {#if showOrigin}
    <Latex2D latex="O" alignX="right" alignY="top" offset={new Vector2(-0.15, -0.15)} />
  {/if}
</g>
