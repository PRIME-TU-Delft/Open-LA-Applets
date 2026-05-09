<script lang="ts">
  import { setContext } from 'svelte';
  setContext('dontScaleWithDefaultZoom', true);

  import { controls } from './animation';
  import RowReduction from '../Row_reduction.svelte';
</script>

<RowReduction {controls} />
