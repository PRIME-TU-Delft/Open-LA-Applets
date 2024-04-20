<script lang="ts">
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { arc, symbol, symbolTriangle } from 'd3';
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';

  export let color: PrimeColor = PrimeColor.black;
  export let points: [Vector2, Vector2] = [new Vector2(1, 0), new Vector2(0, 1)];
  export let origin = new Vector2(0, 0);
  export let width = LINE_WIDTH;
  export let distance = 0.8;
  export let hasHead = false;

  $: startAngle = Math.PI / 2 + points[0].angle();
  $: endAngle = Math.PI / 2 + points[1].angle();
  $: endPosition = points[1].clone().normalize().multiplyScalar(distance);

  $: angleDelta = endAngle - startAngle;

  $: adjustedStartAngle = angleDelta < -Math.PI ? startAngle + 2 * Math.PI : startAngle;
  $: adjustedEndAngle = angleDelta < -Math.PI ? endAngle + 2 * Math.PI : endAngle;
  $: headAngle = (adjustedEndAngle / Math.PI) * 180 + 90 + (angleDelta < 0 ? 180 : 0);

  $: d = arc()({
    innerRadius: distance - width / 2,
    outerRadius: distance + width / 2,
    startAngle: adjustedStartAngle,
    endAngle: adjustedEndAngle
  });

  const triangle = symbol().type(symbolTriangle).size(0.3)();
</script>

<g transform="translate({origin.x},{origin.y})">
  <path {d} fill={color} />
</g>

{#if hasHead}
  <g transform="translate({endPosition.x}, {endPosition.y})">
    <path
      transform="rotate({headAngle}) scale({LINE_WIDTH * 15}) translate({0}, {LINE_WIDTH * 15})"
      d={triangle}
      fill={color}
    />
  </g>
{/if}
