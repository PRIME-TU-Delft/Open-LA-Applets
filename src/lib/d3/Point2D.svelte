<script lang="ts" module>
  export type Point2DProps = {
    position: Vector2;
    shape?: 'circle' | 'square' | 'triangle';
    radius?: number;
    color?: string;
    fill?: string | undefined;
    pulse?: boolean;
    opacity?: number;
    text?: string;
    showTextOnlyOnHover?: boolean;
    fontSize?: number;
    offset?: Vector2;
  };
</script>

<script lang="ts">
  import { LINE_WIDTH, POINT_SIZE } from '$lib/utils/AttributeDimensions';
  import { Vector2 } from 'three';
  import Latex2D from './Latex2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  let {
    position = new Vector2(0, 0),
    shape = 'circle',
    radius = POINT_SIZE,
    color = PrimeColor.black,
    fill = undefined,
    pulse = false,
    opacity = 1,
    text = '',
    fontSize = 1,
    offset = new Vector2(0, 0),
    showTextOnlyOnHover = false
  }: Point2DProps = $props();
</script>

<g class="point2d" {opacity}>
  {#if shape == 'square'}
    <rect
      x={position.x - radius}
      y={position.y - radius}
      height={radius * 2}
      width={radius * 2}
      stroke={color}
      stroke-width={LINE_WIDTH}
      fill={fill ?? color}
    />

    {#if pulse}
      <rect
        class="pulse"
        style="transform-origin: {position.x}px {position.y}px;"
        x={position.x - radius}
        y={position.y - radius}
        height={radius * 2}
        width={radius * 2}
        stroke={color}
        stroke-width={LINE_WIDTH}
        fill={fill ?? color}
      />
    {/if}
  {:else if shape == 'circle'}
    <circle
      cx={position.x}
      cy={position.y}
      r={radius}
      stroke={color}
      stroke-width={LINE_WIDTH}
      fill={fill ?? color}
    />

    {#if pulse}
      <circle
        class="pulse"
        style="transform-origin: {position.x}px {position.y}px;"
        cx={position.x}
        cy={position.y}
        r={radius}
        stroke={color}
        stroke-width={LINE_WIDTH}
        fill={fill ?? color}
      />
    {/if}
  {:else if shape == 'triangle'}
    {@const triRadius = radius * 1.2}
    {@const dx = (triRadius * Math.sqrt(3)) / 2}
    {@const dy = triRadius / 2}
    <polygon
      points={`${position.x},${position.y + triRadius} ${position.x + dx},${position.y - dy} ${position.x - dx},${position.y - dy}`}
      stroke={color}
      stroke-width={LINE_WIDTH}
      fill={fill ?? color}
    />

    {#if pulse}
      <polygon
        class="pulse"
        style="transform-origin: {position.x}px {position.y}px;"
        points={`${position.x},${position.y + triRadius} ${position.x + dx},${position.y - dy} ${position.x - dx},${position.y - dy}`}
        stroke={color}
        stroke-width={LINE_WIDTH}
        fill={fill ?? color}
      />
    {/if}
  {/if}
</g>
{#if text}
  {#if showTextOnlyOnHover}
    <g class="hoverText">
      <Latex2D latex={text} {position} {offset} {fontSize} color={PrimeColor.black} />
    </g>
  {:else}
    <Latex2D latex={text} {position} {offset} {fontSize} color={PrimeColor.black} />
  {/if}
{/if}

<style>
  circle.pulse {
    animation: pulseScale 3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  polygon.pulse {
    animation: pulseScale 3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  rect.pulse {
    animation: pulseScale 3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  @keyframes pulseScale {
    0% {
      transform: scale(3);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.25;
    }
    100% {
      transform: scale(3);
      opacity: 0.5;
    }
  }

  .hoverText {
    display: none;
    pointer-events: none;
  }

  .point2d:hover + .hoverText {
    display: block;
  }
</style>
