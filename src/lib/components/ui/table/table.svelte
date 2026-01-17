<script lang="ts">
  interface Props {
    children?: any;
  }

  let { children }: Props = $props();
</script>

<div class="w-full overflow-x-auto">
  <table class="w-full border-collapse text-sm">
    {@render children?.()}
  </table>
</div>

<style>
  table {
    border: 1px solid #e5e7eb;
  }

  :global(table th) {
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    color: #111827;
    background-color: #f9fafb;
  }

  :global(table td) {
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    color: #374151;
  }

  :global(table tbody tr:hover) {
    background-color: #f9fafb;
  }
</style>
