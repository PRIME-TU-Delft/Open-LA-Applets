<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { arc, symbol, symbolTriangle } from 'd3';
  import { Vector2 } from 'three';

  type AngleProps = {
    color?: string;
    startAngle?: number;
    endAngle?: number;
    origin?: Vector2;
    width?: number;
    distance?: number;
    hasHead?: boolean;
  };

  let {
    color = PrimeColor.black,
    startAngle = 0,
    endAngle = 0,
    origin = new Vector2(0, 0),
    width = LINE_WIDTH,
    distance = 0.8,
    hasHead = false
  }: AngleProps = $props();

  let d = $derived(
    arc()({
      innerRadius: distance - width,
      outerRadius: distance + width,
      startAngle: startAngle + Math.PI / 2,
      endAngle: endAngle + Math.PI / 2 - width
    })
  );

  let triangle = $derived(symbol().type(symbolTriangle).size(width)());
</script>

<!--@component
@props
- color: string=`PrimeColor.black` - The color of the angle.
- startAngle: number=`0` - The start angle of the angle.
- endAngle: number=`0` - The end angle of the angle.
- origin: Vector2=`new Vector2(0,0)` - The origin of the angle.
- width: number=`LINE_WIDTH` - The width of the angle.
- distance: number=`0.8` - The distance of the angle.
- hasHead: boolean=`false` - Whether the angle has a head or not.

@example
<Angle2D startAngle={0} endAngle={(1 / 4) * Math.PI} color={PrimeColor.raspberry} distance={0.5} hasHead />

-->

<g transform="translate({origin.x},{origin.y})">
  <path {d} fill={color} />

  {#if hasHead}
    <g
      transform="rotate({(endAngle / Math.PI) *
        180}) translate({distance}, 0) rotate(180) translate(0, {2 * Math.PI * width})"
    >
      <path transform="" d={triangle} fill={color} />
    </g>
  {/if}
</g>
