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
  import { getContext } from 'svelte';

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

  const _scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const sx = _scale2D?.x ?? 1;
  const sy = _scale2D?.y ?? 1;
  const scaledPos = $derived(new Vector2(position.x * sx, position.y * sy));
</script>

<g class="point2d" {opacity}>
  {#if shape == 'square'}
    <rect
      x={scaledPos.x - radius}
      y={scaledPos.y - radius}
      height={radius * 2}
      width={radius * 2}
      stroke={color}
      stroke-width={LINE_WIDTH}
      fill={fill ?? color}
    />

    {#if pulse}
      <rect
        class="pulse"
        style="transform-origin: {scaledPos.x}px {scaledPos.y}px;"
        x={scaledPos.x - radius}
        y={scaledPos.y - radius}
        height={radius * 2}
        width={radius * 2}
        stroke={color}
        stroke-width={LINE_WIDTH}
        fill={fill ?? color}
      />
    {/if}
  {:else if shape == 'circle'}
    <circle
      cx={scaledPos.x}
      cy={scaledPos.y}
      r={radius}
      stroke={color}
      stroke-width={LINE_WIDTH}
      fill={fill ?? color}
    />

    {#if pulse}
      <circle
        class="pulse"
        style="transform-origin: {scaledPos.x}px {scaledPos.y}px;"
        cx={scaledPos.x}
        cy={scaledPos.y}
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
      points={`${scaledPos.x},${scaledPos.y + triRadius} ${scaledPos.x + dx},${scaledPos.y - dy} ${scaledPos.x - dx},${scaledPos.y - dy}`}
      stroke={color}
      stroke-width={LINE_WIDTH}
      fill={fill ?? color}
    />

    {#if pulse}
      <polygon
        class="pulse"
        style="transform-origin: {scaledPos.x}px {scaledPos.y}px;"
        points={`${scaledPos.x},${scaledPos.y + triRadius} ${scaledPos.x + dx},${scaledPos.y - dy} ${scaledPos.x - dx},${scaledPos.y - dy}`}
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
      <Latex2D latex={text} position={scaledPos} {offset} {fontSize} color={PrimeColor.black} />
    </g>
  {:else}
    <Latex2D latex={text} position={scaledPos} {offset} {fontSize} color={PrimeColor.black} />
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
