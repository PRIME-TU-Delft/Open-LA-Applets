<script lang="ts" module>
  export type Point2DProps = {
    position: Vector2;
    shape?: 'circle' | 'square' | 'triangle';
    radius?: number;
    color?: string;
    pulse?: boolean;
    opacity?: number;
    text?: string;
    showTextOnlyOnHover?: boolean;
    fontSize?: number;
    offset?: Vector2;
  };
</script>

<script lang="ts">
  import { POINT_SIZE } from '$lib/utils/AttributeDimensions';
  import { Vector2 } from 'three';
  import Latex2D from './Latex2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  let {
    position = new Vector2(0, 0),
    shape = 'circle',
    radius = POINT_SIZE,
    color = PrimeColor.black,
    pulse = false,
    opacity = 1,
    text = '',
    fontSize = 1,
    offset = new Vector2(0, 0),
    showTextOnlyOnHover = false
  }: Point2DProps = $props();
</script>

<g class="point2d">
  {#if shape == 'square'}
    <rect
      x={position.x - radius}
      y={position.y - radius}
      height={radius * 2}
      width={radius * 2}
      fill={color}
      {opacity}
    />

    {#if pulse}
      <rect
        class="pulse"
        style="--r-small: {radius * 4}px; --r-large: {radius *
          8}px; --posX: {position.x}px; --posY: {position.y}px;"
        fill={color}
      />
    {/if}
  {:else if shape == 'circle'}
    <circle cx={position.x} cy={position.y} r={radius} fill={color} {opacity} />

    {#if pulse}
      <circle
        class="pulse"
        style="--r-small: {radius * 2}; --r-large: {radius * 4};"
        cx={position.x}
        cy={position.y}
        r={radius * 2}
        fill={color}
      />
    {/if}
  {:else if shape == 'triangle'}
    {@const triRadius = radius * 1.2}
    {@const dx = (triRadius * Math.sqrt(3)) / 2}
    {@const dy = triRadius / 2}
    <polygon
      fill={color}
      {opacity}
      points={`${position.x},${position.y + triRadius} ${position.x + dx},${position.y - dy} ${position.x - dx},${position.y - dy}`}
    />

    {#if pulse}
      <polygon
        class="pulse"
        style="transform-origin: {position.x}px {position.y}px;"
        fill={color}
        points={`${position.x},${position.y + triRadius} ${position.x + dx},${position.y - dy} ${position.x - dx},${position.y - dy}`}
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
    animation: pulseCircle 3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  polygon.pulse {
    animation: pulseTriangle 3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  rect.pulse {
    animation: pulseRect 3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
    /* width: var(--r-large); */
  }

  @keyframes pulseCircle {
    0% {
      r: var(--r-large);
      opacity: 0.5;
    }
    50% {
      r: var(--r-small);
      opacity: 0.25;
    }
    100% {
      r: var(--r-large);
      opacity: 0.5;
    }
  }

  @keyframes pulseRect {
    0% {
      width: var(--r-large);
      height: var(--r-large);
      x: calc(var(--posX) - var(--r-large) / 2);
      y: calc(var(--posY) - var(--r-large) / 2);
      opacity: 0.5;
    }
    50% {
      width: var(--r-small);
      height: var(--r-small);
      x: calc(var(--posX) - var(--r-small) / 2);
      y: calc(var(--posY) - var(--r-small) / 2);
      opacity: 0.25;
    }
    100% {
      width: var(--r-large);
      height: var(--r-large);
      x: calc(var(--posX) - var(--r-large) / 2);
      y: calc(var(--posY) - var(--r-large) / 2);
      opacity: 0.5;
    }
  }

  @keyframes pulseTriangle {
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
