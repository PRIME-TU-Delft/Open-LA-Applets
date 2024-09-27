<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Vector2 } from 'three';

  type Line2DProps = {
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
  }: Line2DProps = $props();
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

<circle
  cx={position.x}
  cy={position.y}
  r={radius}
  {fill}
  stroke={color}
  stroke-width={width}
  stroke-dasharray="{width} {isDashed ? width : 0}"
/>
