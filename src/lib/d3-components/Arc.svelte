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
  export let smallestAngle = false;

  $: startAngle = points[0].angle();
  $: endAngle = points[1].angle();

  // Arc defined by D3
  let d = arc()({
    innerRadius: distance - width / 2,
    outerRadius: distance + width / 2,
    startAngle: Math.PI / 2 + startAngle,
    //startAngle: -Math.PI * 1.5 + startAngle,
    endAngle: Math.PI / 2 + endAngle
  });

  function update(start: number, end: number) {
    let startAngle2 = Math.PI / 2 + start;
    if (smallestAngle && Math.abs(start - end) > Math.PI) {
      startAngle2 = -Math.PI * 1.5 + startAngle;
    }
    d = arc()({
      innerRadius: distance - width / 2,
      outerRadius: distance + width / 2,
      startAngle: startAngle2,
      endAngle: Math.PI / 2 + end
    });
  }

  $: update(startAngle, endAngle);

</script>

<g transform="translate({origin.x},{origin.y})">
  <path {d} fill={color} />
</g>
