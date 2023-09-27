<script lang="ts">
  import { axisBottom, axisLeft, scaleLinear, select } from 'd3';
  import { fade } from 'svelte/transition';

  export let width: number;
  export let height: number;
  export let length = 30;
  export let strokeWidth = 0.25;
  export let zoomLevel = 1;

  let axis: SVGGElement;
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

<g bind:this={axis}>
  <g class="text-xl" bind:this={gx} transform="translate(0,{height / 2})">
    {#each x.ticks(length) as d (d)}
      {@const middleAdd = (2 * vmax) / length}
      <g transform="translate({x(d)},0)">
        <line y1={-2 * vmax} y2={2 * vmax} stroke="black" stroke-width={strokeWidth} />

        {#if zoomLevel >= 1}
          <line
            transition:fade
            y1={-2 * vmax}
            y2={2 * vmax}
            x1={middleAdd}
            x2={middleAdd}
            stroke="black"
            stroke-width={strokeWidth / 2}
          />
        {/if}
        {#if zoomLevel >= 2}
          <line
            transition:fade
            x1={0.5 * middleAdd}
            x2={0.5 * middleAdd}
            y1={-2 * vmax}
            y2={2 * vmax}
            stroke="black"
            stroke-width={strokeWidth / 4}
          />
          <line
            transition:fade
            x1={1.5 * middleAdd}
            x2={1.5 * middleAdd}
            y1={-2 * vmax}
            y2={2 * vmax}
            stroke="black"
            stroke-width={strokeWidth / 4}
          />
        {/if}
      </g>
    {/each}
  </g>

  <g class="text-xl" bind:this={gy} transform="translate({width / 2},0)">
    {#each y.ticks(length) as d (d)}
      {@const middleAdd = (2 * vmax) / length}
      <g transform="translate(0,{y(d)})">
        <line x1={-2 * vmax} x2={2 * vmax} stroke="black" stroke-width={strokeWidth} />
        {#if zoomLevel >= 1}
          <line
            transition:fade
            y1={middleAdd}
            y2={middleAdd}
            x1={-2 * vmax}
            x2={2 * vmax}
            stroke="black"
            stroke-width={strokeWidth / 2}
          />
        {/if}
        {#if zoomLevel >= 2}
          <line
            transition:fade
            y1={0.5 * middleAdd}
            y2={0.5 * middleAdd}
            x1={-2 * vmax}
            x2={2 * vmax}
            stroke="black"
            stroke-width={strokeWidth / 4}
          />
          <line
            transition:fade
            y1={1.5 * middleAdd}
            y2={1.5 * middleAdd}
            x1={-2 * vmax}
            x2={2 * vmax}
            stroke="black"
            stroke-width={strokeWidth / 4}
          />
        {/if}
      </g>
    {/each}
  </g>

  <slot fnx={x} fny={y} />
</g>
