<script lang="ts">
  import { VECTOR_WIDTH } from '$lib/utils/AttributeDimensions';
  import { PrimeColor, type ColorString } from '$lib/utils/PrimeColors';
  import type { Snippet } from 'svelte';
  import { Vector2 } from 'three';
  import Line2D from './Line2D.svelte';
  import Triangle2D from './Triangle2D.svelte';

  type VectorProps = {
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

  const endPoint = $derived(origin.clone().add(direction.clone().multiplyScalar(length))); // store with tip of the vector
  const coneHeight = $derived(hideHead ? 0 : CONE_HEIGHT);

  $effect(() => {
    if (!noNormalise) {
      direction = direction.clone().normalize();
    }
  });

  const coneStart = $derived(
    origin.clone().add(direction.clone().multiplyScalar(length - coneHeight / 2))
  );
  const leftConePoint = $derived(
    coneStart
      .clone()
      .add(new Vector2(-direction.y, direction.x).normalize().multiplyScalar(CONE_DIAMETER))
  );
  const rightConePoint = $derived(
    coneStart
      .clone()
      .add(new Vector2(direction.y, -direction.x).normalize().multiplyScalar(CONE_DIAMETER))
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
<Line2D start={origin} end={coneStart} {color} width={radius} {isDashed} />

{#if !hideHead}
  <Triangle2D points={[leftConePoint, endPoint, rightConePoint]} {color} />
{/if}

{#if children}
  {@render children(endPoint)}
{/if}
