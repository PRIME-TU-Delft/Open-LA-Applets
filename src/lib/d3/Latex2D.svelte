<script lang="ts" module>
  export type Latex2DProps = {
    latex: string;
    fontSize?: number;
    position?: Vector2;
    offset?: Vector2;
    rotation?: number;
    extend?: number;
    color?: string;
    centerX?: boolean;
    centerY?: boolean;
    alignX?: 'left' | 'right' | null;
  };
</script>

<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import { Vector2 } from 'three';

  let {
    latex,
    fontSize = 1,
    position = new Vector2(0, 0),
    offset = new Vector2(0, 0),
    rotation = 0,
    extend = 0,
    color = 'black',
    centerX = false,
    centerY = false,
    alignX = null
  }: Latex2DProps = $props();

  let extendedOffset = $derived(position.clone().normalize().multiplyScalar(extend));

  let style = $derived.by(() => {
    const base = 'display: inline-block; width: max-content;';

    if (alignX == 'right' && centerY) return base + ' transform: translate(-100%, -50%);';
    if (alignX == 'right') return base + ' transform: translateX(-100%);';
    if (alignX == 'left' && centerY) return base + ' transform: translateY(-50%);';
    if (alignX == 'left') return base;
    if (centerX && centerY) return base + ' transform: translate(-50%, -50%);';
    if (centerX) return base + ' transform: translateX(-50%);';
    if (centerY) return base + ' transform: translateY(-50%);';
    return base;
  });

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
</script>

<g
  transform="translate({position.x + offset.x + extendedOffset.x}, {position.y +
    offset.y +
    extendedOffset.y}) rotate({rotation}) scale({0.02 * fontSize},{-0.02 * fontSize})"
>
  <foreignObject x="0" y="0" width=".1" height=".1" class="overflow-visible">
    {#if isSafari}
      <Latex {latex} {color} outputType="mathml" {style} />
    {:else}
      <Latex {latex} {color} outputType="html" {style} />
    {/if}
  </foreignObject>
</g>
