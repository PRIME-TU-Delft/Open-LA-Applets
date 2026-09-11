<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Vector2 } from 'three';
  import { getProjection2D } from './Projection2D';

  export type Circle2DProps = {
    position?: Vector2;
    radius?: number;
    color?: string;
    width?: number;
    isDashed?: boolean;
    fill?: string;
  };

  let {
    position = new Vector2(),
    radius = 1,
    color = 'black',
    width = LINE_WIDTH,
    isDashed = false,
    fill = 'none'
  }: Circle2DProps = $props();

  const projection = getProjection2D();
  const screenPosition = $derived(projection.toScreen(position));
  // The radius is a world-space extent, so it scales per axis (non-uniform scale gives an ellipse).
  const screenRadiusX = $derived(projection.xToScreen(radius));
  const screenRadiusY = $derived(projection.yToScreen(radius));
</script>

<!-- @component
@props
- position: Vector2=`new Vector2(0,0)` - The position of the circle.
- radius: number=1 - The radius of the circle.
- color: string=`'black'` - The color of the circle.
- width: number=`LINE_WIDTH` - The width of the circle.
- isDashed: boolean=false - Whether the circle is dashed or not.
- fill: string=`'none'` - The fill of the circle.

@example
<Circle2D position={new Vector2(1, 1)} radius={1} />

-->

{#if screenRadiusX === screenRadiusY}
  <circle
    cx={screenPosition.x}
    cy={screenPosition.y}
    r={screenRadiusX}
    {fill}
    stroke={color}
    stroke-width={width}
    stroke-dasharray={isDashed ? `${4 * width} ${4 * width}` : undefined}
  />
{:else}
  <ellipse
    cx={screenPosition.x}
    cy={screenPosition.y}
    rx={screenRadiusX}
    ry={screenRadiusY}
    {fill}
    stroke={color}
    stroke-width={width}
    stroke-dasharray={isDashed ? `${4 * width} ${4 * width}` : undefined}
  />
{/if}
