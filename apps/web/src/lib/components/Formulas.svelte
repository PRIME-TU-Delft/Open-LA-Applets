<script>
  import { activityStore } from '$lib/activityStore';

  export let showFormulas = true;
  export let isChangingSliders = false;
  export let isIframe = false;
  export let isFullscreen = false;
</script>

<div class="formulas flex gap-1 w-full absolute z-50 justify-between">
  {#if isIframe}
    <div class="select-none w-fit">
      {#if !isFullscreen && $activityStore}
        <p class="py-3 px-6 bg-blue-500/90 rounded-r-lg w-fit text-white">Interactive mode</p>
      {:else if !isFullscreen}
        <p class="py-3 px-6 bg-base-300/80 rounded-r-lg">Click once to enable interactivity</p>
      {/if}
    </div>
  {/if}

  <!-- TODO: change this logic -->
  {#if isChangingSliders || showFormulas || !isIframe || isFullscreen}
    <div class="menu p-4 bg-base-200 rounded-lg" class:inset={!isIframe || isFullscreen}>
      <slot />
    </div>
  {/if}
</div>

<style lang="postcss">
  .inset {
    @apply m-2;
  }
</style>
