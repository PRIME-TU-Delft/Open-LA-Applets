<script lang="ts" module>
  export type Latex2DProps = {
    latex: string;
    fontSize?: number;
    position?: Vector2;
    offset?: Vector2;
    rotation?: number;
    extend?: number;
    color?: string;
    alignX?: 'left' | 'right' | 'center' | null;
    alignY?: 'top' | 'bottom' | 'center' | null;
    dimOnHover?: boolean;
  };
</script>

<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import { cameraState } from '$lib/stores/camera.svelte';
  import { getContext, setContext } from 'svelte';
  import { Vector2 } from 'three';

  let {
    latex,
    fontSize = 1,
    position = new Vector2(0, 0),
    offset = new Vector2(0, 0),
    rotation = 0,
    extend = 0,
    color = 'black',
    alignX = null,
    alignY = null,
    dimOnHover = false
  }: Latex2DProps = $props();

  const scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const scaleX = scale2D?.x ?? 1;
  const scaleY = scale2D?.y ?? 1;

  const scaledPosition = $derived(
    new Vector2(position.x * scaleX, position.y * scaleY)
  );

  let extendedOffset = $derived(scaledPosition.clone().normalize().multiplyScalar(extend));

  let style = $derived.by(() => {
    const base = 'display: inline-block; width: max-content;';

    const translateX = alignX === 'right' ? '-100%' : alignX === 'center' ? '-50%' : null;

    const translateY = alignY === 'bottom' ? '-100%' : alignY === 'center' ? '-50%' : null;

    if (translateX && translateY)
      return base + ` transform: translate(${translateX}, ${translateY});`;
    if (translateX) return base + ` transform: translateX(${translateX});`;
    if (translateY) return base + ` transform: translateY(${translateY});`;
    return base;
  });

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const defZoom = $derived.by(() => {
    const contextZoom = getContext('default-zoom') as number | undefined;
    if (contextZoom !== undefined) return contextZoom;

    if (getContext('is-split')) return cameraState.splitCamera2D?.defaultZoom || 1;

    return cameraState.camera2D?.defaultZoom || 1;
  });

  const dontScaleWithDefaultZoom = getContext('dontScaleWithDefaultZoom') === true;

  const scale = $derived.by(() => {
    if (dontScaleWithDefaultZoom) return 0.02 * fontSize;

    return (0.02 * fontSize) / defZoom;
  });
</script>

<g
  class={dimOnHover ? 'latex-dim' : ''}
  transform="translate({scaledPosition.x + offset.x + extendedOffset.x}, {scaledPosition.y +
    offset.y +
    extendedOffset.y}) rotate({rotation}) scale({scale},{-scale})"
>
  <foreignObject x="0" y="0" width=".1" height=".1" class="overflow-visible">
    {#if isSafari}
      <Latex {latex} {color} outputType="mathml" {style} />
    {:else}
      <Latex {latex} {color} outputType="html" {style} />
    {/if}
  </foreignObject>
</g>

<style>
  .latex-dim:hover {
    animation: dim 1s forwards;
  }

  @keyframes dim {
    0% {
      opacity: 100%;
    }

    25% {
      opacity: 100%;
    }

    80% {
      opacity: 20%;
    }

    100% {
      opacity: 10%;
    }
  }
</style>
