<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import { Vector2 } from 'three';

  type Latex2DProps = {
    latex: string;
    fontSize?: number;
    position?: Vector2;
    offset?: Vector2;
    extend?: number;
    color?: string;
  };

  let {
    latex,
    fontSize = 1,
    position = new Vector2(0, 0),
    offset = new Vector2(0, 0),
    extend = 0,
    color
  }: Latex2DProps = $props();

  const possibleInvertColor = $derived(color ?? (globalState.dark ? 'white' : 'black'));

  let extendedOffset = $derived(position.clone().normalize().multiplyScalar(extend));

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
</script>

<g
  transform="translate({position.x + offset.x + extendedOffset.x}, {position.y +
    offset.y +
    extendedOffset.y}) scale({0.02 * fontSize},{-0.02 * fontSize})"
>
  <foreignObject x="0" y="0" width=".1" height=".1" class="overflow-visible">
    {#if isSafari}
      <Latex {latex} color={possibleInvertColor} outputType="mathml" />
    {:else}
      <Latex {latex} color={possibleInvertColor} outputType="html" />
    {/if}
  </foreignObject>
</g>
