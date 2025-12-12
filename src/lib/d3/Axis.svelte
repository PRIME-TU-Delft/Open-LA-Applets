<script lang="ts">
  import { Vector2 } from 'three';
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Latex2D from './Latex2D.svelte';

  type AxisProps = {
    length?: number;
    showOrigin?: boolean;
    showAxisNumbers?: boolean;
    logarithmicX?: boolean;
    logarithmicY?: boolean;
    scaleX?: number;
    scaleY?: number;
  };

  let {
    length = GRID_SIZE_2D,
    showOrigin = true,
    showAxisNumbers = true,
    logarithmicX = false,
    logarithmicY = false,
    scaleX = 1,
    scaleY = 1
  }: AxisProps = $props();

  // Generate indeces for the grid lines from -length to length including 0
  let axisIndeces = $derived([...Array(length + 1).keys()].flatMap((a) => [-a, a]));

  function stokeWidth(index: number) {
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

  const yAxisTextX = logarithmicY ? 0.3 : -0.3;
  const yNegativeAxisTextX = logarithmicY ? 0.3 : -0.55;
</script>

<g>
  {#each axisIndeces as index, idx (idx)}
    <!-- Grid Lines -->
    <line
      x1={index}
      y1={-length}
      x2={index}
      y2={length}
      stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
      stroke-width={stokeWidth(index)}
    />
    <line
      x1={-length}
      y1={index}
      x2={length}
      y2={index}
      stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
      stroke-width={stokeWidth(index)}
    />

    <!-- Tick marks -->
    <line x1={index} y1={-0.1} x2={index} y2={0.1} stroke="black" stroke-width={0.02} />
    <line x1={-0.1} y1={index} x2={0.1} y2={index} stroke="black" stroke-width={0.02} />

    {#if index != 0 && showAxisNumbers}
      <!-- X axis number labels -->
      {#if index > 0}
        <Latex2D
          latex={getTickText(index, 'x')}
          position={new Vector2(index * scaleX - 0.07, -0.15)}
        />
      {:else}
        <Latex2D
          latex={getTickText(index, 'x')}
          position={new Vector2(index * scaleX - 0.15, -0.15)}
        />
      {/if}

      <!-- Y axis number labels -->
      {#if index > 0}
        <Latex2D
          latex={getTickText(index, 'y')}
          position={new Vector2(yAxisTextX, index * scaleY + 0.12)}
        />
      {:else}
        <Latex2D
          latex={getTickText(index, 'y')}
          position={new Vector2(yNegativeAxisTextX, index * scaleY + 0.1)}
        />
      {/if}
    {/if}
  {/each}

  <!-- Axis labels -->
  {#if showOrigin}
    <Latex2D latex="O" offset={new Vector2(-0.28, -0.11)} />
  {/if}
</g>
