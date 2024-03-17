<script lang="ts">
  import Canvas from '$lib/d3-components/Canvas.svelte';
  import Vector from '$lib/d3-components/Vector.svelte';
  import type { Controls } from '$lib/utils/Controls';
  import { Vector2 } from 'three';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  export let title: string = 'default without sliders';
  export let controls: Controls<G> | undefined = undefined;
</script>

<Canvas height="20rem" {title} bind:controls>
  {#if controls}
    {#if controls[0] != undefined}
      <Vector direction={new Vector2(controls[0], 1)} length={3} color="green" />
    {/if}
    {#if controls[1] != undefined}
      <Vector direction={new Vector2(controls[0], controls[1])} length={3} color="blue" />
    {/if}
    {#if controls[2] != undefined}
      <Vector direction={new Vector2(controls[0], controls[1])} length={controls[2]} color="red" />
    {/if}
  {/if}
</Canvas>
