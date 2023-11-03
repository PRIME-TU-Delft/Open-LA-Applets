<script lang="ts">
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { arc } from 'd3';

  export let color: PrimeColor = PrimeColor.black;
  export let points: [Vector2, Vector2] = [new Vector2(1, 0), new Vector2(0, 1)];
  export let origin = new Vector2(0, 0);
  export let width = 0.05;
  export let distance = 0.5;

  $: startAngle = points[0].angle();
  $: endAngle = points[1].angle();

  // Arc defined by D3
  $: d = arc()({
    innerRadius: distance - width / 2,
    outerRadius: distance + width / 2,
    startAngle: Math.PI / 2 + startAngle,
    endAngle: Math.PI / 2 + endAngle
  });
</script>

<g transform="translate({origin.x},{origin.y})">
  <path {d} fill={color} />
</g>
