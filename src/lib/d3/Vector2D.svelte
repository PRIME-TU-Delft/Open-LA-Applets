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

  let {
    color = PrimeColor.getRandomColor(),
    origin = new Vector2(0, 0),
    direction = new Vector2(1, 0),
    length = 1,
    radius = VECTOR_WIDTH,
    hideHead = false,
    isDashed = false,
    noNormalise: noNormalise = false,
    children
  }: VectorProps = $props();

  const CONE_HEIGHT = $derived(Math.max(7 * radius, 0.4));
  const CONE_DIAMETER = $derived(Math.max(1.5 * radius, 0.1));

  const normalizedDirection = $derived(noNormalise ? direction : direction.clone().normalize());

  const endPoint = $derived(origin.clone().add(normalizedDirection.clone().multiplyScalar(length))); // store with tip of the vector
  const coneHeight = $derived(hideHead ? 0 : CONE_HEIGHT);

  const coneStart = $derived(length + coneHeight * (length > 0 ? -0.5 : 1.5));

  const coneStartPos = $derived(
    origin.clone().add(normalizedDirection.clone().multiplyScalar(coneStart - coneHeight / 2))
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
- children: Snippet<[Vector2]> - The children to render at the end of the vector. Slot prop is the endPoint of the vector.

@example
<Vector2D origin={new Vector2(1, 1)} direction={new Vector2(2, 0)} noNormalise />
-->

<!-- Line 2D -->
<Line2D start={origin} end={coneStartPos} {color} width={radius} {isDashed} />

{#if !hideHead}
  {#if length == 0}
    <Point2D position={new Vector2()} {color} />
  {:else}
    <g
      transform={`translate(${origin.x}, ${origin.y}) rotate(${(normalizedDirection.angle() * 180) / Math.PI}) translate(${coneStart - coneHeight / 2}, 0) rotate(${length < 0 ? 90 : -90})`}
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
