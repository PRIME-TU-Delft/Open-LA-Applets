<script lang="ts">
  import { line, select, ticks, zoom } from 'd3';
  import { onMount } from 'svelte';
  import Axis from './Axis.svelte';

  export let width: number;
  export let height: number;

  let svg: SVGSVGElement;

  let data = ticks(-5, 5, 30).map((x, i) => i * Math.sin(x));

  function handleZoom(e: any) {
    select('svg g').attr('transform', e.transform);
  }

  const zoomProtocol = zoom<SVGSVGElement, unknown>()
    .scaleExtent([1 / 3, 3])
    .on('zoom', handleZoom);

  function handleResize() {
    select(svg).call(zoomProtocol);
  }

  onMount(() => {
    select(svg).call(zoomProtocol);
  });
</script>

<svelte:window on:resize={handleResize} />

<svg bind:this={svg} {width} {height}>
  <Axis {width} {height} let:fnx let:fny>
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      d={line((d, i) => fnx(i), fny)(data)}
    />
    <g fill="white" stroke="currentColor" stroke-width="1.5">
      {#each data as d, i (i)}
        <circle cx={fnx(i)} cy={fny(d)} r="2.5" fill="white" />
      {/each}
    </g>
  </Axis>
</svg>
