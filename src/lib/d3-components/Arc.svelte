<script lang="ts">
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { arc } from 'd3';
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';

  export let color: PrimeColor = PrimeColor.black;
  export let points: [Vector2, Vector2] = [new Vector2(1, 0), new Vector2(0, 1)];
  export let origin = new Vector2(0, 0);
  export let width = LINE_WIDTH;
  export let distance = 0.8;

  $: startAngle = Math.PI / 2 + points[0].angle();
  $: endAngle = Math.PI / 2 + points[1].angle();

  // Makes sure the start angle is always less than the end angle
  $: adjustedStartAngle =
    startAngle > endAngle && startAngle - endAngle > Math.PI / 2
      ? startAngle - 2 * Math.PI
      : startAngle;

  $: d = arc()({
    innerRadius: distance - width / 2,
    outerRadius: distance + width / 2,
    startAngle: adjustedStartAngle,
    endAngle: endAngle
  });
</script>

<g transform="translate({origin.x},{origin.y})">
  <path {d} fill={color} />
</g>
