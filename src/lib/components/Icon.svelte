<script lang="ts">
  import { cn } from '$lib/utils';

  export let path: string;
  export let size = 1;
  export let color = 'currentColor';
  export let flipV = false;
  export let flipH = false;
  export let rotate = 0;
  export let spin = 0;
  export let title = '';
  let className = '';
  export { className as class };

  $: scaleV = flipV ? -1 : 1;
  $: scaleH = flipH ? -1 : 1;
  $: absSpin = Math.abs(spin);
</script>

<svg
  viewBox="0 0 24 24"
  style="--color: {color}; --size: {size}rem; --rotate: {rotate}deg; --scaleV: {scaleV}; --scaleH: {scaleH}; --spin-duration: {absSpin}s;"
  class={cn(className)}
>
  {#if title}<title>{title}</title>{/if}

  <g class:spin={spin > 0} class:spinReverse={spin < 0}>
    <path d={path} />
  </g>
</svg>

<style>
  svg {
    vertical-align: middle;
    fill: var(--color);
    width: var(--size);
    height: var(--size);
    transform: rotate(var(--rotate)) scale(var(--scaleV), var(--scaleH));
  }

  /* If spin is strictly > 0, class spin is added to g and plays {spinFrames} in {spin-duration} seconds  */
  g.spin {
    transform-origin: center;
    animation: spinFrames linear var(--spin-duration) infinite;
  }

  /* If spin is strictly < 0, class spinReverse is added to g and plays {spinReverseFrames} in {spin-duration} seconds */
  g.spinReverse {
    fill: green;
    transform-origin: center;
    animation: spinReverseFrames linear var(--spin-duration) infinite;
  }

  @keyframes spinFrames {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes spinReverseFrames {
    to {
      transform: rotate(-360deg);
    }
  }
</style>
