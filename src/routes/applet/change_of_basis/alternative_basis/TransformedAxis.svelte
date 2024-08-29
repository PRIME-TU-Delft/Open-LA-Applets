<script lang="ts">
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  type AxisProps = {
    length?: number;
    showOrigin?: boolean;
    basis: [Vector2, Vector2];
    showAxisNumbers?: boolean;
  };

  let {
    length = GRID_SIZE_2D,
    showOrigin = true,
    showAxisNumbers = true,
    basis = [new Vector2(1, 0), new Vector2(0, 1)]
  }: AxisProps = $props();

  // Generate indeces for the grid lines from -length to length including 0
  let axisIndeces = $derived([...Array(length + 1).keys()].flatMap((a) => [-a, a]));

  function stokeWidth(index: number) {
    if (index % 10 == 0) return 0.02;
    if (index % 5 == 0) return 0.01;
    return 0.005;
  }

  function radiansToDegrees(radians: number) {
    return radians * (180 / Math.PI);
  }

  let xRotation = radiansToDegrees(Math.atan(basis[0].y / basis[0].x));
  let yRotation = radiansToDegrees(Math.atan(-basis[1].x / basis[1].y));
</script>

<g>
  <line
    x1={0}
    y1={-length}
    x2={0}
    y2={length}
    stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
    stroke-width={0.04}
  />
  <line
    x1={-length}
    y1={0}
    x2={length}
    y2={0}
    stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
    stroke-width={0.04}
  />

  {#each axisIndeces as index}
    <!-- Grid Lines -->
    <line
      transform="rotate({yRotation}) scale({basis[1].length()})"
      x1={index}
      y1={-length}
      x2={index}
      y2={length}
      stroke={PrimeColor.black + PrimeColor.opacity(0.5)}
      stroke-width={stokeWidth(index)}
    />
    <line
      transform="rotate({xRotation}) scale({basis[0].length() / 2})"
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
      {#if index > 0 && index % 2 == 0}
        <Latex2D latex={index.toLocaleString()} position={new Vector2(index - 0.07, -0.15)} />
      {:else if index % 2 == 0}
        <Latex2D latex={index.toLocaleString()} position={new Vector2(index - 0.15, -0.15)} />
      {/if}

      <!-- Y axis number labels -->
      {#if index > 0 && index % 2 == 0}
        <Latex2D latex={index.toLocaleString()} position={new Vector2(-0.3, index + 0.12)} />
      {:else if index % 2 == 0}
        <Latex2D latex={index.toLocaleString()} position={new Vector2(-0.55, index + 0.1)} />
      {/if}
    {/if}
  {/each}

  <!-- Axis labels -->
  {#if showOrigin}
    <Latex2D latex={'O'} offset={new Vector2(-0.28, -0.11)} />
  {/if}
</g>
