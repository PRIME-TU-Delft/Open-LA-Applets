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
    background?: string;
    padding?: string;
    compact?: boolean;
    /** Keep this label's on-screen size constant during live interactive zoom (e.g. axis labels). */
    fixedScreenScale?: boolean;
  };
</script>

<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import { cameraState } from '$lib/stores/camera.svelte';
  import { getContext } from 'svelte';
  import { getProjection2D } from './Projection2D';
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
    dimOnHover = false,
    background = undefined,
    padding = '0.2em',
    compact = undefined,
    fixedScreenScale = false
  }: Latex2DProps = $props();

  const effectiveCompact = $derived(compact ?? background !== undefined);

  const projection = getProjection2D();

  const screenPosition = $derived(projection.toScreen(position));

  let extendedOffset = $derived(screenPosition.clone().normalize().multiplyScalar(extend));

  let style = $derived.by(() => {
    const base = `display: inline-block; width: max-content;${background !== undefined ? ` background-color: ${background}; padding: ${padding};` : ''}`;

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
  const REFERENCE_WIDTH = 500; // baseline canvas width text sizing is calibrated against

  const defWidth = (getContext('default-width') as number | undefined) ?? REFERENCE_WIDTH; // baseline canvas width text sizing is calibrated against

  const getLiveZoomK = getContext('current-zoom-k') as (() => number) | undefined;
  const liveZoomK = $derived(fixedScreenScale ? (getLiveZoomK?.() ?? 1) : 1);

  const scale = $derived.by(() => {
    if (dontScaleWithDefaultZoom) return 0.03 * fontSize;

    return ((0.03 * fontSize) / defZoom / liveZoomK) * (REFERENCE_WIDTH / defWidth);
  });
</script>

<g
  class={dimOnHover ? 'latex-dim' : ''}
  transform="translate({screenPosition.x + offset.x + extendedOffset.x}, {screenPosition.y +
    offset.y +
    extendedOffset.y}) rotate({rotation}) scale({scale},{-scale})"
>
  <foreignObject x="0" y="0" width=".1" height=".1" class="overflow-visible">
    {#if isSafari}
      <Latex {latex} {color} outputType="mathml" {style} compact={effectiveCompact} />
    {:else}
      <Latex {latex} {color} outputType="html" {style} compact={effectiveCompact} />
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
