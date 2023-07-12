<script>
  export let isInset = false;
</script>

<div
  class="flex gap-1 p-3 bg-base-200 rounded-lg absolute bottom-0 right-20 transition-all items-center"
  class:inset={isInset}
>
  <slot />
</div>

<style lang="postcss">
  .inset {
    @apply bottom-2;
  }
</style>
