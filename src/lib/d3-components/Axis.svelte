<script lang="ts">
  import type { GridType } from './grids/GridTypes';
  import { axisBottom, axisLeft, scaleLinear, select } from 'd3';
  import Grid from './grids/Grid.svelte';

  export let width: number;
  export let height: number;
  export let length = 30;
  export let zoomLevel = 1;
  export let gridType: GridType;

  let gx: SVGGElement;
  let gy: SVGGElement;

  $: vmax = Math.max(width, height);
  $: x = scaleLinear()
    .range([width / 2 - 2 * vmax, width / 2 + 2 * vmax])
    .domain([-length, length]);
  $: y = scaleLinear()
    .range([height / 2 - 2 * vmax, height / 2 + 2 * vmax])
    .domain([length, -length]);

  $: select(gy).call(
    axisLeft(y)
      .ticks(length)
      .tickFormat(() => '')
  );
  $: select(gx).call(
    axisBottom(x)
      .ticks(length)
      .tickFormat(() => '')
  );
</script>

<g>
  <g bind:this={gx} transform="translate(0,{height / 2})">
    <Grid linearScale={x} {width} {height} {zoomLevel} {length} type={gridType} side="x" />
  </g>

  <g bind:this={gy} transform="translate({width / 2},0)">
    <Grid linearScale={y} {width} {height} {zoomLevel} {length} type={gridType} side="y" />
  </g>

  <slot fnx={x} fny={y} />
</g>
