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
  import Point2D from './Point2D.svelte';
  import { getProjection2D } from '$lib/utils/Projection2D';

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
  const scaledOrigin = $derived(projection.toScreen(origin));
  const endPoint = $derived(projection.toScreen(displayEnd));

  // on-screen UNIT direction of the shaft; sign carries a negative length
  const screenDirSign = $derived(length > 0 ? 1 : -1);
  const screenDir = $derived(
    projection.toScreenDir(normalizedDirection).multiplyScalar(screenDirSign)
  );

  const coneStartPos = $derived(endPoint.clone().sub(screenDir.clone().multiplyScalar(coneHeight)));
  const lineEndPos = $derived(
    endPoint.clone().sub(screenDir.clone().multiplyScalar(0.95 * coneHeight))
  );

  const secondConeStartPos = $derived(
    scaledOrigin.clone().add(screenDir.clone().multiplyScalar(coneHeight))
  );
  const lineStartPos = $derived(
    scaledOrigin.clone().add(screenDir.clone().multiplyScalar(0.95 * coneHeight))
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
- doubleEnded: boolean - Whether the vector is double-ended or not.
- isDashed: boolean - Whether the vector is dashed or not.
- noNormalise: boolean - Whether to normalize the vector or not.
- headLength: number - The length of the head of the vector. If not specified, it will be determined by the radius.
- children: Snippet<[Vector2]> - The children to render at the end of the vector. Slot prop is the endPoint of the vector.

@example
<Vector2D origin={new Vector2(1, 1)} direction={new Vector2(2, 0)} noNormalise />
-->

<!--
  Vector2D computes final screen geometry itself (shaft end and cones are
  screen-space, sizes must not distort under non-uniform scale), so it emits raw
  SVG instead of Line2D/Triangle2D children, which would re-project.
  The shaft runs 5% into the cone so no gap shows between shaft and arrowhead.
-->
<!-- Shaft -->
<line
  x1={(doubleEnded ? lineStartPos : scaledOrigin).x}
  y1={(doubleEnded ? lineStartPos : scaledOrigin).y}
  x2={lineEndPos.x}
  y2={lineEndPos.y}
  stroke={color}
  stroke-width={radius}
  stroke-dasharray={isDashed ? `${4 * radius} ${4 * radius}` : undefined}
/>

{#if !hideHead}
  {#if length == 0}
    <Point2D position={origin} {color} />
  {:else}
    <g
      transform={`translate(${coneStartPos.x}, ${coneStartPos.y}) rotate(${(screenDir.angle() * 180) / Math.PI - 90})`}
    >
      <polygon points={`${CONE_DIAMETER},0 ${-CONE_DIAMETER},0 0,${coneHeight}`} fill={color} />
    </g>
  {/if}
{/if}

{#if doubleEnded}
  <g
    transform={`translate(${secondConeStartPos.x}, ${secondConeStartPos.y}) rotate(${(screenDir.angle() * 180) / Math.PI + 90})`}
  >
    <polygon points={`${CONE_DIAMETER},0 ${-CONE_DIAMETER},0 0,${coneHeight}`} fill={color} />
  </g>
{/if}

{#if children}
  {@render children(displayEnd)}
{/if}
