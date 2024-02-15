<script>
  export let isInset = false;
</script>

<div
  class="flex gap-1 py-2 px-3 bg-base-200 rounded-lg absolute bottom-0 right-16 transition-all items-center"
  class:inset={isInset}
>
  <slot />
</div>

<style lang="postcss">
  .inset {
    @apply m-2;
  }
</style>
