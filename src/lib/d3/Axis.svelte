<script lang="ts" module>
  export type AxisProps = {
    length?: number;
    showOrigin?: boolean;
    showAxisNumbers?: boolean;
    logarithmicX?: boolean;
    logarithmicY?: boolean;
    scaleX?: number;
    scaleY?: number;
    skipX?: number;
    skipY?: number;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Latex2D from './Latex2D.svelte';

  let {
    length = GRID_SIZE_2D,
    showOrigin = true,
    showAxisNumbers = true,
    logarithmicX = false,
    logarithmicY = false,
    scaleX = 1,
    scaleY = 1,
    skipX = 0,
    skipY = 0
  }: AxisProps = $props();

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

  function showSkippedTick(index: number, skip: number) {
    if (index === 0) return true;
    return Math.abs(index) % (skip + 1) === 0;
  }

  let yAxisTextX = $derived(logarithmicY ? 0.2 : -0.2);
</script>

<g>
  {#each axisIndicesX as index, idx (idx)}
    <!-- Grid Lines -->
    <line
      x1={index}
      y1={-length}
      x2={index}
      y2={length}
      stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
      stroke-width={stokeWidth(index, logarithmicX)}
    />

    <!-- Tick marks -->
    {#if showSkippedTick(index, skipX)}
      <line x1={index} y1={-0.1} x2={index} y2={0.1} stroke="black" stroke-width={0.02} />
    {/if}

    {#if index != 0 && showAxisNumbers && showSkippedTick(index, skipX)}
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

  {#each axisIndicesY as index, idx (idx)}
    <!-- Grid Lines -->
    <line
      x1={-length}
      y1={index}
      x2={length}
      y2={index}
      stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
      stroke-width={stokeWidth(index, logarithmicY)}
    />

    <!-- Tick marks -->
    {#if showSkippedTick(index, skipY)}
      <line x1={-0.1} y1={index} x2={0.1} y2={index} stroke="black" stroke-width={0.02} />
    {/if}

    {#if index != 0 && showAxisNumbers && showSkippedTick(index, skipY)}
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

  <!-- Axis labels -->
  {#if showOrigin}
    <Latex2D latex="O" offset={new Vector2(-0.28, -0.11)} />
  {/if}
</g>
