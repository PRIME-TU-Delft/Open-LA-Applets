<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import type { Toggle } from '$lib/utils/Toggle';

  export let toggle: Toggle;
</script>

<label class="flex items-center gap-1">
  {#if toggle.label != undefined}
    <Latex latex={toggle.label} />:
  {/if}
  <input type="checkbox" class="toggle" bind:checked={toggle.value} />
</label>
