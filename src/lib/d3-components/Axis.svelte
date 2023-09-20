<script lang="ts">
  import { axisBottom, axisLeft, scaleLinear, select } from 'd3';

  export let width: number;
  export let height: number;
  export let length = 30;

  let gx: SVGGElement;
  let gy: SVGGElement;

  $: vmax = Math.max(width, height);
  $: x = scaleLinear()
    .range([width / 2 - 2 * vmax, width / 2 + 2 * vmax])
    .domain([-length, length]);
  $: y = scaleLinear()
    .range([height / 2 - 2 * vmax, height / 2 + 2 * vmax])
    .domain([length, -length]);

  $: select(gy).call(axisLeft(y).ticks(length));
  $: select(gx).call(axisBottom(x).ticks(length));
</script>

<g>
  <g class="text-xl" bind:this={gx} transform="translate(0,{height / 2})" />
  <g class="text-xl" bind:this={gy} transform="translate({width / 2},0)" />
  <slot fnx={x} fny={y} />
</g>
