<script lang="ts">
  import type { Vector2 } from 'three';

  export let position: Vector2;
  export let isSquare = false;
  export let radius: number = 0.125;
  export let color: string = 'black';
  export let pulse = false;
  export let opacity = 1;
</script>

{#if isSquare}
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
{:else}
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
{/if}

<style>
  circle.pulse {
    animation: pulseCircle 3s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
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
</style>
