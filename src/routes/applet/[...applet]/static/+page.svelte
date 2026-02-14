<script lang="ts">
  import { page } from '$app/state';
  import { getScreenshotName } from '$lib/screenshots/utils';
  import { qr } from '@svelte-put/qr/svg';
  import { error } from '@sveltejs/kit';

  // eslint-disable-next-line local-rules/require-url-params-info
  const queryParams = new URLSearchParams(page.url.searchParams);
  const showQR = queryParams.get('qr') === 'true';

  const applet = $derived(page.params.applet || '');

  let found: boolean = $state(true);
</script>

<div class="flex h-full w-full items-center justify-center text-center">
  <div class="relative inline-block">
    {#if found}
      <img
        src={'/' + getScreenshotName(applet)}
        alt={applet}
        class="block max-h-screen max-w-screen object-contain"
        onerror={() => {
          found = false;
          throw error(404, 'Static image for this applet not found');
        }}
      />
      {#if showQR}
        <div
          class="absolute right-0 bottom-0 h-auto w-24 rounded-lg bg-gradient-to-bl from-blue-400 to-blue-500 p-2 transition-all duration-500 md:w-32 lg:w-48"
        >
          <div class="rounded-lg bg-white text-left">
            <div class="ml-2 text-xs lg:text-base">Use interactively:</div>
            <svg
              class="p-1 pt-0"
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
