<script lang="ts">
  import Latex2D from '$lib/d3-components/Latex.svelte';
  import { hexbin } from 'd3-hexbin';
  import { Vector2 } from 'three';

  export let length = 30;
  export let showOrigin = true;
  export let showAxisNumbers = true;

  const indexMult = 2 / Math.tan(Math.PI / 3);
  const totalLength = length * indexMult;
  const totalRadius = totalLength * indexMult + 1;
  let axisIndeces = [...Array(length + 1).keys()].filter((a) => a != 0).flatMap((a) => [-a, a]);

  const hex = hexbin().radius(totalRadius);

  function stokeWidth(index: number) {
    if (index % 10 == 0) return 0.02;
    if (index % 5 == 0) return 0.01;
    return 0.005;
  }
</script>

<mask id="myMask">
  <path transform="rotate(30 0 0)" fill="white" d={hex.hexagon()} />
</mask>

<g mask="url(#myMask)">
  <line x1={0} y1={-totalRadius} x2={0} y2={totalRadius} stroke="black" stroke-width={0.02} />
  <line x1={-totalRadius} y1={0} x2={totalRadius} y2={0} stroke="black" stroke-width={0.02} />
  <line
    transform="rotate(-60 0 0)"
    x1={-totalRadius}
    y1={0}
    x2={totalRadius}
    y2={0}
    stroke="black"
    stroke-width={0.02}
  />
  <line
    transform="rotate(60 0 0)"
    x1={-totalRadius}
    y1={0}
    x2={totalRadius}
    y2={0}
    stroke="black"
    stroke-width={0.02}
  />

  <!-- Axis labels for x and y and lines for y -->
  {#each axisIndeces as index}
    {@const newIndex = index * indexMult}
    <!-- Grid Lines -->
    <line
      x1={-totalRadius}
      y1={newIndex}
      x2={totalRadius}
      y2={newIndex}
      stroke="black"
      stroke-width={stokeWidth(index)}
    />
    <line
      transform-origin="{-index} 0"
      transform="rotate(30 {index} 0)"
      x1={newIndex}
      y1={-totalRadius}
      x2={newIndex}
      y2={totalRadius}
      stroke="black"
      stroke-width={stokeWidth(index)}
    />
    <line
      transform-origin="{-index} 0"
      transform="rotate(-30 {index} 0)"
      x1={newIndex}
      y1={-totalRadius}
      x2={newIndex}
      y2={totalRadius}
      stroke="black"
      stroke-width={stokeWidth(index)}
    />

    <!-- Tick marks -->
    <line x1={newIndex} y1={-0.1} x2={newIndex} y2={0.1} stroke="black" stroke-width={0.02} />
    <line x1={-0.1} y1={newIndex} x2={0.1} y2={newIndex} stroke="black" stroke-width={0.02} />

    <!-- Axis labels -->
    {#if showOrigin}
      <Latex2D latex={'O'} offset={new Vector2(-0.28, -0.11)} />
    {/if}

    {#if index != 0 && showAxisNumbers}
      <!-- X axis number labels -->
      {#if index > 0}
        <Latex2D latex={newIndex.toFixed(2)} position={new Vector2(newIndex - 0.07, -0.15)} />
      {:else}
        <Latex2D latex={newIndex.toFixed(2)} position={new Vector2(newIndex - 0.3, -0.15)} />
      {/if}

      <!-- Y axis number labels -->
      {#if index > 0}
        <Latex2D latex={newIndex.toFixed(2)} position={new Vector2(-0.7, newIndex + 0.12)} />
      {:else}
        <Latex2D latex={newIndex.toFixed(2)} position={new Vector2(-0.95, newIndex + 0.12)} />
      {/if}
    {/if}
  {/each}
</g>
