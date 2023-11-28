<script lang="ts">
  import Canvas from '$lib/d3-components/Canvas.svelte';
  import Vector from '$lib/d3-components/Vector.svelte';
  import type { Sliders } from '$lib/utils/Slider';
  import { Vector2 } from 'three';

  export let title: string = 'default without sliders';
  export let sliders: Sliders | undefined = undefined;
</script>

<Canvas height="20rem" {title} bind:sliders>
  {#if sliders}
    {#if sliders?.x}
      <Vector direction={new Vector2(sliders.x, 1)} length={3} color="green" />
    {/if}
    {#if sliders?.y}
      <Vector direction={new Vector2(sliders.x, sliders.y)} length={3} color="blue" />
    {/if}
    {#if sliders?.z}
      <Vector direction={new Vector2(sliders.x, sliders.y)} length={sliders.z} color="red" />
    {/if}
  {/if}
</Canvas>
