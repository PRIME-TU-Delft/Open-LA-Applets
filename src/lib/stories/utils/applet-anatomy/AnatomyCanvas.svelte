<script lang="ts">
  import Vector from '$lib/d3-components/Vector.svelte';
  import { Canvas3D } from '$lib/threlte-components';
  import type { Formula } from '$lib/utils/Formulas';
  import type { Sliders } from '$lib/utils/Slider';
  import { Vector2 } from 'three';

  export let title: string = 'default without sliders';
  export let sliders: Sliders | undefined = undefined;
  export let formulas: Formula[] = [];
</script>

<Canvas3D {formulas} height="20rem" {title} bind:sliders>
  {#if sliders}
    <Vector direction={new Vector2(sliders.x, sliders.y)} length={sliders.z} color="red" />
  {/if}
</Canvas3D>
