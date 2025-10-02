<script lang="ts">
  import { page } from '$app/state';
  import { getScreenshotName } from '$lib/screenshots/utils';
  import { qr } from '@svelte-put/qr/svg';
  import { error } from '@sveltejs/kit';

  const queryParams = new URLSearchParams(page.url.searchParams);
  const showQR = queryParams.get('qr') === 'true';

  const applet = $derived(page.params.applet);

  let found: boolean = $state(true);
</script>

<div class="h-full w-full content-center justify-center text-center">
  <div class="relative h-auto w-full">
    {#if found}
      <img
        src={'/screenshots/' + getScreenshotName(applet)}
        alt={applet}
        class="w-full"
        onerror={() => {
          found = false;
          throw error(404, 'Static image for this applet not found');
        }}
      />
      {#if showQR}
        <div
          class="absolute right-0 bottom-0 h-auto w-48 rounded-lg bg-gradient-to-bl from-blue-400 to-blue-500 p-2 transition-all duration-500"
        >
          <div class="rounded-lg bg-white">
            <span class="ml-1">Use interactively:</span>
            <svg
              use:qr={{
                data: 'https://openla.ewi.tudelft.nl/applet/' + applet,
                logo: '/primeLogo-narrow.png',
                shape: 'circle'
              }}
            />
          </div>
        </div>
      {/if}
    {:else}
      <span>Static image for <b>{applet}</b> not found</span>
    {/if}
  </div>
</div>
