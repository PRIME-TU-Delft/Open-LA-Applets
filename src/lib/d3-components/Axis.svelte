<script lang="ts">
  import { GridType } from './grids/GridTypes';
  import SquareGrid from './grids/SquareGrid.svelte';

  export let length = 30;
  export let gridType: GridType;

  export let showOrigin = true;
  export let showAxisNumbers = true;
</script>

<g class="axis">
  {#if gridType == GridType.Square}
    <SquareGrid {length} {showOrigin} {showAxisNumbers} />
  {:else}
    <p>Grid type not implemented</p>
  {/if}
</g>
