<script lang="ts">
  export let visible = true;
</script>

{#if visible}
  <!-- TODO: set max width for very large screens -->
  <div class="container mx-auto px-4 md:px-20 overflow-auto">
    <div class="bg-slate-100 rounded px-3 py-2 flex flex-col gap-2">
      <slot />
    </div>
  </div>
{/if}
