<script lang="ts">
  import { page } from '$app/state';
  import { getScreenshotName } from '$lib/screenshots/utils';

  const applet = $derived(page.params.applet);

  let found: boolean = $state(true);
</script>

<div class="flex h-full w-full content-center justify-center">
  {#if found}
    <img
      src={'/screenshots/' + getScreenshotName(applet)}
      alt={applet}
      class="h-full w-auto"
      onerror={() => {
        found = false;
      }}
    />
  {:else}
    <span>Static image for <b>{applet}</b> not found</span>
  {/if}
</div>
