<script lang="ts" module>
  export type LabelAlign = 'start' | 'center' | 'end';

  export type XLabelSide = 'top' | 'bottom';
  export type YLabelSide = 'left' | 'right';

  export type XLabelPosition = LabelAlign | XLabelSide | `${XLabelSide}-${LabelAlign}`; // e.g. "top-center", "bottom-end"

  export type YLabelPosition = LabelAlign | YLabelSide | `${YLabelSide}-${LabelAlign}`; // e.g. "left-start", "right-center"

  export type AxisProps = {
    length?: number;
    showOrigin?: boolean;
    showAxisNumbers?: boolean;
    xLabel?: string;
    yLabel?: string;
    xLabelPosition?: XLabelPosition;
    yLabelPosition?: YLabelPosition;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Latex2D from './Latex2D.svelte';

  let { length = GRID_SIZE_2D, showOrigin = true, showAxisNumbers = true }: AxisProps = $props();

  // Generate indeces for the grid lines from -length to length including 0
  let axisIndeces = $derived([...Array(length + 1).keys()].flatMap((a) => [-a, a]));

  function stokeWidth(index: number) {
    if (index % 10 == 0) return 0.02;
    if (index % 5 == 0) return 0.01;
    return 0.005;
  }
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
        <Latex2D latex={index.toLocaleString()} position={new Vector2(index - 0.07, -0.15)} />
      {:else}
        <Latex2D latex={index.toLocaleString()} position={new Vector2(index - 0.15, -0.15)} />
      {/if}

      <!-- Y axis number labels -->
      {#if index > 0}
        <Latex2D latex={index.toLocaleString()} position={new Vector2(-0.3, index + 0.12)} />
      {:else}
        <Latex2D latex={index.toLocaleString()} position={new Vector2(-0.55, index + 0.1)} />
      {/if}
    {/if}
  {/each}

  <!-- Axis labels -->
  {#if showOrigin}
    <Latex2D latex="O" offset={new Vector2(-0.28, -0.11)} />
  {/if}
</g>
