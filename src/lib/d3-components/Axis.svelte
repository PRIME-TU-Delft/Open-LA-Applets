<script lang="ts">
  import { GridType } from './grids/GridTypes';
  import SquareGrid from './grids/SquareGrid.svelte';
  import TriangleGrid from './grids/TriangleGrid.svelte';

  export let length = 30;
  export let gridType: GridType;

  export let showOrigin = true;
  export let showAxisNumbers = true;
</script>

<g class="axis">
  {#if gridType == GridType.Square}
    <SquareGrid {length} {showOrigin} {showAxisNumbers} />
  {:else if gridType == GridType.Triangle}
    <TriangleGrid {length} {showOrigin} {showAxisNumbers} />
  {/if}
</g>
