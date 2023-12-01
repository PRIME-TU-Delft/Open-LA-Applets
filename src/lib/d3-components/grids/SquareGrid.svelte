<script lang="ts">
  import { Vector2 } from 'three';
  import { Latex2D } from '..';

  export let length = 30;
  export let showOrigin = true;
  export let showAxisNumbers = true;

  let axisIndeces = [...Array(length + 1).keys()].flatMap((a) => [-a, a]);

  function stokeWidth(index: number) {
    if (index % 10 == 0) return 0.02;
    if (index % 5 == 0) return 0.01;
    return 0.005;
  }
</script>

{#each axisIndeces as index}
  {#if showOrigin}
    <Latex2D latex={'O'} offset={new Vector2(-0.28, -0.11)} />
  {/if}

  <line
    x1={index}
    y1={-length}
    x2={index}
    y2={length}
    stroke="black"
    stroke-width={stokeWidth(index)}
  />
  <line
    x1={-length}
    y1={index}
    x2={length}
    y2={index}
    stroke="black"
    stroke-width={stokeWidth(index)}
  />

  {#if index != 0 && showAxisNumbers}
    <!-- X axis number labels -->
    {#if index > 0}
      <Latex2D latex={index.toLocaleString()} position={new Vector2(index - 0.07, -0.1)} />
    {:else}
      <Latex2D latex={index.toLocaleString()} position={new Vector2(index - 0.15, -0.1)} />
    {/if}

    <!-- Y axis number labels -->
    {#if index > 0}
      <Latex2D latex={index.toLocaleString()} position={new Vector2(-0.28, index + 0.12)} />
    {:else}
      <Latex2D latex={index.toLocaleString()} position={new Vector2(-0.5, index + 0.12)} />
    {/if}
  {/if}
{/each}
