<script lang="ts" module>
  export type VectorProps = {
    color?: ColorString;
    origin?: Vector2;
    direction?: Vector2;
    length?: number;
    radius?: number;
    hideHead?: boolean;
    isDashed?: boolean;
    noNormalise?: boolean;
    headLength?: number;
    children?: Snippet<[Vector2]>;
  };
</script>

<script lang="ts">
  import { VECTOR_WIDTH } from '$lib/utils/AttributeDimensions';
  import { PrimeColor, type ColorString } from '$lib/utils/PrimeColors';
  import type { Snippet } from 'svelte';
  import { Vector2 } from 'three';
  import Line2D from './Line2D.svelte';
  import Point2D from './Point2D.svelte';
  import Triangle2D from './Triangle2D.svelte';
  import { getContext, setContext } from 'svelte';

  let {
    color = PrimeColor.getRandomColor(),
    origin = new Vector2(0, 0),
    direction = new Vector2(1, 0),
    length = 1,
    radius = VECTOR_WIDTH,
    hideHead = false,
    isDashed = false,
    noNormalise: noNormalise = false,
    headLength,
    children
  }: VectorProps = $props();

  const _scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const sx = _scale2D?.x ?? 1;
  const sy = _scale2D?.y ?? 1;
  setContext('scale2D', { x: 1, y: 1 });

  const CONE_HEIGHT = $derived(Math.max(7 * radius, 0.4));
  const CONE_DIAMETER = $derived(Math.max(1.5 * radius, 0.1));

  const normalizedDirection = $derived(noNormalise ? direction : direction.clone().normalize());
  const coneHeight = $derived(hideHead ? 0 : headLength !== undefined ? headLength : CONE_HEIGHT);
  const coneStart = $derived(length + coneHeight * (length > 0 ? -0.5 : 1.5));

  const scaledOrigin = $derived(new Vector2(origin.x * sx, origin.y * sy));
  const displayEnd = $derived(
    origin.clone().add(normalizedDirection.clone().multiplyScalar(length))
  );
  const endPoint = $derived(new Vector2(displayEnd.x * sx, displayEnd.y * sy));
  const displayConeStart = $derived(
    origin.clone().add(normalizedDirection.clone().multiplyScalar(coneStart - coneHeight / 2))
  );
  const coneStartPos = $derived(new Vector2(displayConeStart.x * sx, displayConeStart.y * sy));

  const worldDirection = $derived(
    new Vector2(normalizedDirection.x * sx, normalizedDirection.y * sy)
  );
</script>

<!--@component
@props
- color: ColorString - The color of the vector.
- origin: Vector2 - The origin of the vector.
- direction: Vector2 - The direction of the vector.
- length: number - The length of the vector.
- radius: number - The width of the vector.
- hideHead: boolean - Whether to hide the head of the vector.
- isDashed: boolean - Whether the vector is dashed or not.
- noNormalise: boolean - Whether to normalize the vector or not.
- headLength: number - The length of the head of the vector. If not specified, it will be determined by the radius.
- children: Snippet<[Vector2]> - The children to render at the end of the vector. Slot prop is the endPoint of the vector.

@example
<Vector2D origin={new Vector2(1, 1)} direction={new Vector2(2, 0)} noNormalise />
-->

<!-- Line 2D -->
<Line2D start={scaledOrigin} end={coneStartPos} {color} width={radius} {isDashed} />

{#if !hideHead}
  {#if length == 0}
    <Point2D position={scaledOrigin} {color} />
  {:else}
    <g
      transform={`translate(${coneStartPos.x}, ${coneStartPos.y}) rotate(${(worldDirection.angle() * 180) / Math.PI + (length < 0 ? 90 : -90)})`}
    >
      <Triangle2D
        points={[
          new Vector2(CONE_DIAMETER, 0),
          new Vector2(-CONE_DIAMETER, 0),
          new Vector2(0, coneHeight)
        ]}
        {color}
      />
    </g>
  {/if}
{/if}

{#if children}
  {@render children(endPoint)}
{/if}
