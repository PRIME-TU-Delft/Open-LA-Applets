<script lang="ts" module>
  export type VectorProps = {
    color?: ColorString;
    origin?: Vector2;
    direction?: Vector2;
    length?: number;
    radius?: number;
    hideHead?: boolean;
    doubleEnded?: boolean;
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
  import ArrowHead2D from './ArrowHead2D.svelte';
  import Line2D from './Line2D.svelte';
  import Point2D from './Point2D.svelte';
  import { getProjection2D } from './Projection2D';

  let {
    color = PrimeColor.getRandomColor(),
    origin = new Vector2(0, 0),
    direction = new Vector2(1, 0),
    length = 1,
    radius = VECTOR_WIDTH,
    hideHead = false,
    doubleEnded = false,
    isDashed = false,
    noNormalise: noNormalise = false,
    headLength,
    children
  }: VectorProps = $props();

  const projection = getProjection2D();

  const CONE_HEIGHT = $derived(Math.max(7 * radius, 0.4));
  const CONE_DIAMETER = $derived(Math.max(1.5 * radius, 0.1));

  const normalizedDirection = $derived(noNormalise ? direction : direction.clone().normalize());
  const coneHeight = $derived(hideHead ? 0 : headLength !== undefined ? headLength : CONE_HEIGHT);

  const displayEnd = $derived(
    origin.clone().add(normalizedDirection.clone().multiplyScalar(length))
  );

  // world coords projected once, in screen space
  const screenOrigin = $derived(projection.toScreen(origin));
  const screenEnd = $derived(projection.toScreen(displayEnd));

  // on-screen UNIT direction of the shaft; sign carries a negative length
  const screenDirSign = $derived(length > 0 ? 1 : -1);
  const screenDir = $derived(
    projection.toScreenDir(normalizedDirection).multiplyScalar(screenDirSign)
  );

  // The cones are screen-space sizes (they must not distort under non-uniform scale),
  // so the shaft is shortened in screen space. It runs 5% into the cone so no gap shows.
  const coneStartPos = $derived(
    screenEnd.clone().sub(screenDir.clone().multiplyScalar(coneHeight))
  );
  const lineEndPos = $derived(
    screenEnd.clone().sub(screenDir.clone().multiplyScalar(0.95 * coneHeight))
  );

  const secondConeStartPos = $derived(
    screenOrigin.clone().add(screenDir.clone().multiplyScalar(coneHeight))
  );
  const lineStartPos = $derived(
    screenOrigin.clone().add(screenDir.clone().multiplyScalar(0.95 * coneHeight))
  );

  // Line2D projects its endpoints, so the screen-space shaft ends go in as world coordinates.
  const shaftStart = $derived(doubleEnded ? projection.toWorld(lineStartPos) : origin);
  const shaftEnd = $derived(projection.toWorld(lineEndPos));
</script>

<!--@component
@props
- color: ColorString - The color of the vector.
- origin: Vector2 - The origin of the vector.
- direction: Vector2 - The direction of the vector.
- length: number - The length of the vector.
- radius: number - The width of the vector.
- hideHead: boolean - Whether to hide the head of the vector.
- doubleEnded: boolean - Whether the vector is double-ended or not.
- isDashed: boolean - Whether the vector is dashed or not.
- noNormalise: boolean - Whether to normalize the vector or not.
- headLength: number - The length of the head of the vector. If not specified, it will be determined by the radius.
- children: Snippet<[Vector2]> - The children to render at the end of the vector. The snippet argument is the end point of the vector in world coordinates (the same space as `origin`), so children position themselves with it like any other primitive, e.g. `<Latex2D position={end} />`.

@example
<Vector2D origin={new Vector2(1, 1)} direction={new Vector2(2, 0)} noNormalise />
-->

<Line2D start={shaftStart} end={shaftEnd} {color} width={radius} {isDashed} />

{#if !hideHead}
  {#if length == 0}
    <Point2D position={origin} {color} />
  {:else}
    <ArrowHead2D
      screenPosition={coneStartPos}
      angle={screenDir.angle()}
      length={coneHeight}
      halfWidth={CONE_DIAMETER}
      {color}
    />
  {/if}
{/if}

{#if doubleEnded}
  <ArrowHead2D
    screenPosition={secondConeStartPos}
    angle={screenDir.angle() + Math.PI}
    length={coneHeight}
    halfWidth={CONE_DIAMETER}
    {color}
  />
{/if}

{#if children}
  {@render children(displayEnd)}
{/if}
