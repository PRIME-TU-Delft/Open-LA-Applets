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

  const inverted = $derived.by(() => startAngle > endAngle);
  const rotation = $derived.by(() => {
    let angle = 90;

    if (inverted) {
      angle += (startAngle / Math.PI) * 180;
    }

    return angle;
  });

  let d = $derived.by(() => {
    if (inverted) {
      return arc()({
        innerRadius: distance - width / 2,
        outerRadius: distance + width / 2,
        startAngle: 0,
        endAngle: 2 * Math.PI - startAngle + endAngle
      });
    } else {
      return arc()({
        innerRadius: distance - width / 2,
        outerRadius: distance + width / 2,
        startAngle: startAngle,
        endAngle: endAngle
      });
    }
  });

  let triangle = $derived(
    symbol()
      .type(symbolTriangle)
      .size(2 * width)()
  );
</script>

<g transform="translate({origin.x}, {origin.y}) rotate({rotation})">
  <path {d} fill={color} />

  {#if hasHead}
    <g
      transform="rotate({(endAngle / Math.PI) * 180 -
        90}) translate({distance}, 0) rotate(180) translate(0, {2 * Math.PI * width})"
    >
      <path transform="" d={triangle} fill={color} />
    </g>
  {/if}
</g>
