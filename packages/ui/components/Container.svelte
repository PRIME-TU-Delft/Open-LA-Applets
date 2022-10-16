<script lang="ts">
  export let visible = true;
</script>

{#if visible}
  <!-- TODO: set max width for very large screens -->
  <section class="container mx-auto overflow-auto px-4 md:px-20">
    <div class="flex flex-col gap-2 rounded bg-slate-100 px-3 py-2">
      <slot />
    </div>
  </section>
{/if}
