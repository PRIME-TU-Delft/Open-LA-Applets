<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Vector2 } from 'three';
  import { getProjection2D } from '$lib/utils/Projection2D';

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
  const scaledPos = $derived(projection.toScreen(position));
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

{#if projection.scaleX === projection.scaleY}
  <circle
    cx={scaledPos.x}
    cy={scaledPos.y}
    r={radius * projection.scaleX}
    {fill}
    stroke={color}
    stroke-width={width}
    stroke-dasharray={isDashed ? `${4 * width} ${4 * width}` : undefined}
  />
{:else}
  <ellipse
    cx={scaledPos.x}
    cy={scaledPos.y}
    rx={radius * projection.scaleX}
    ry={radius * projection.scaleY}
    {fill}
    stroke={color}
    stroke-width={width}
    stroke-dasharray={isDashed ? `${4 * width} ${4 * width}` : undefined}
  />
{/if}
