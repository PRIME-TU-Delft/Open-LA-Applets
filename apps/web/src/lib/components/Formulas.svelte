<script>
  export let showFormulas = true;
  export let isIframe = false;
  export let isFullscreen = false;
</script>

{#if showFormulas || !isIframe || isFullscreen}
  <div
    class="formulas top-0 right-0 menu p-4 absolute bg-base-200 rounded-lg"
    class:inset={!isIframe || isFullscreen}
  >
    <slot />
  </div>
{/if}

<style lang="postcss">
  .formulas.inset {
    @apply right-2 top-2;
  }

  @media (min-width: 640px) {
    .formulas {
      @apply left-0 bottom-0 rounded-l-none;
      top: auto !important;
      right: auto !important;

      &.inset {
        @apply left-2 bottom-2 rounded-lg;
      }
    }
  }
</style>
