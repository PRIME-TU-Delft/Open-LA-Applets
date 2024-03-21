<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { arc, symbol, symbolTriangle } from 'd3';
  import { Vector2 } from 'three';

  export let color: PrimeColor = PrimeColor.black;
  export let startAngle = 0;
  export let endAngle = 0;
  export let origin = new Vector2(0, 0);
  export let width = LINE_WIDTH;
  export let distance = 0.8;
  export let hasHead = false;

  $: d = arc()({
    innerRadius: distance - width / 2,
    outerRadius: distance + width / 2,
    startAngle: startAngle + Math.PI / 2,
    endAngle: endAngle + Math.PI / 2
  });

  const triangle = symbol()
    .type(symbolTriangle)
    .size(2 * width)();
</script>

<g transform="translate({origin.x},{origin.y})">
  <path {d} fill={color} />
</g>

{#if hasHead}
  <g
    transform="rotate({(endAngle / Math.PI) *
      180}) translate({distance}, 0) rotate(180) translate(0, {2 * Math.PI * width})"
  >
    <path transform="" d={triangle} fill={color} />
  </g>
{/if}
