<script lang="ts">
  import { page } from '$app/state';
  import { cameraState } from '$lib/stores/camera.svelte';
  import Copy from '@lucide/svelte/icons/copy';
  import ExternalLink from '@lucide/svelte/icons/external-link';
  import { fly } from 'svelte/transition';
  import Button from './ui/button/button.svelte';
  import { Checkbox } from './ui/checkbox';
  import { Label } from './ui/label';
  import Textarea from './ui/textarea/textarea.svelte';
  import Table from './ui/table/table.svelte';
  import { _, locale } from 'svelte-i18n';
  import { fromStore } from 'svelte/store';
  import { appletState } from '$lib/stores/applet.svelte';

  let includeState = $state(false); // If true, the url will include the current state of the applet  (camera position, etc...)
  let showStateURLCopySucess = $state(false);
  let showParamURLCopySucess = $state(false);

  // Reset URLParamsInfo when navigating to a new page
  $effect(() => {
    const _currentPath = page.url.pathname;
    return () => {
      appletState.URLParamsInfo = [];
    };
  });

  const stateUrl = $derived.by(() => {
    const url = new URL(page.url.origin + page.url.pathname);

    const lang = fromStore(locale);
    if (lang.current) url.searchParams.set('lang', lang.current);

    if (!includeState) {
      return url.toString();
    }

    if (cameraState.camera3D) {
      url.searchParams.set('position3D', cameraState.camera3D.positionString(2));
      url.searchParams.set('zoom3D', cameraState.camera3D.zoomString(2));
    }

    if (cameraState.camera2D) {
      url.searchParams.set('position2D', cameraState.camera2D.positionString(2));
      url.searchParams.set('zoom2D', cameraState.camera2D.zoomString(2));
    }

    if (cameraState.splitCamera3D) {
      url.searchParams.set('split-position3D', cameraState.splitCamera3D.positionString(2));
      url.searchParams.set('split-zoom3D', cameraState.splitCamera3D.zoomString(2));
    }

    if (cameraState.splitCamera2D) {
      url.searchParams.set('split-position2D', cameraState.splitCamera2D.positionString(2));
      url.searchParams.set('split-zoom2D', cameraState.splitCamera2D.zoomString(2));
    }

    return url.toString();
  });

  const urlWithCustomParams = $derived.by(() => {
    const url = new URL(page.url.origin + page.url.pathname);

    appletState.URLParamsInfo.forEach((param) => {
      url.searchParams.set(param.paramKey, param.currentValue());
    });

    return url.toString();
  });

  const githubLink = $derived.by(() => {
    const refUrl = page?.url?.pathname.replace('/applet/', '');
    const lastUrl = refUrl?.split('/')?.slice(-1)[0]; // Last part of the url

    // %28 = (, %29 = )
    let url = 'https://github.com/PRIME-TU-Delft/turborepo-visuals/issues?q=is%3Aissue+%28';
    url += lastUrl;
    url += '+OR+';
    url += lastUrl?.replaceAll('_', '');
    url += '+OR+';
    url += lastUrl.split('_')[0];

    return url + '%29';
  });

  function copyStateURLToClipboard() {
    navigator.clipboard.writeText(stateUrl);

    showStateURLCopySucess = true;

    setTimeout(() => {
      showStateURLCopySucess = false;
    }, 2000);
  }

  function copyParamURLToClipboard() {
    navigator.clipboard.writeText(urlWithCustomParams);

    showParamURLCopySucess = true;

    setTimeout(() => {
      showParamURLCopySucess = false;
    }, 2000);
  }
</script>

<div class="max-h-64 overflow-y-auto rounded border border-gray-200">
  <div class="mb-4 flex items-center gap-2">
    <Checkbox id="include-state" bind:checked={includeState} />
    <Label
      for="include-state"
      class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      <span>{$_('ui.embed_include_state')}</span>
    </Label>
  </div>

  <Label
    for="url-state"
    class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {$_('ui.embed_applet_url')}
  </Label>

  <div class="relative h-full w-full">
    <Textarea readonly value={stateUrl} />
    {#if showStateURLCopySucess}
      <div class="absolute bottom-1 left-1 text-green-700" in:fly={{ y: 20 }}>
        {$_('ui.clipboard_copied')}
      </div>
    {/if}
  </div>

  <!-- eslint-disable svelte/no-navigation-without-resolve -->
  <div class="mt-2 flex w-max gap-2 overflow-x-auto">
    <Button onclick={() => copyStateURLToClipboard()}>
      {$_('ui.clipboard_copy')}
      <Copy class="ml-2 size-4" />
    </Button>

    <a href={stateUrl} target="_blank">
      <Button>
        {$_('ui.open_new_tab')}
        <ExternalLink class="ml-2 size-4" />
      </Button>
    </a>

    <a href={githubLink} target="_blank">
      <Button>
        {$_('ui.open_github')}

        <svg
          class="ml-2 size-4"
          width="98"
          height="96"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 98 96"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            fill="#fff"
          />
        </svg>
      </Button>
    </a>
  </div>

  {#if appletState.URLParamsInfo && appletState.URLParamsInfo.length > 0}
    <div class="mt-6 w-full">
      <h3 class="mb-3 font-semibold">
        {$_('ui.custom_url_parameters')}
      </h3>

      <Table>
        <thead>
          <tr>
            <th>{$_('ui.url_param_key')}</th>
            <th>{$_('ui.description')}</th>
            <th>{$_('ui.default_value')}</th>
          </tr>
        </thead>
        <tbody>
          {#each appletState.URLParamsInfo as paramInfo (paramInfo.paramKey)}
            <tr>
              <td
                ><code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800"
                  >{paramInfo.paramKey}</code
                ></td
              >
              <td>{paramInfo.description}</td>
              <td
                ><code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800"
                  >{paramInfo.defaultValue}</code
                ></td
              >
            </tr>
          {/each}
        </tbody>
      </Table>
    </div>

    <Label
      for="url-custom-params"
      class="mt-4 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {$_('ui.embed_applet_url_params')}
    </Label>

    <div class="relative my-2 h-full w-full">
      <Textarea readonly value={urlWithCustomParams} />
      {#if showParamURLCopySucess}
        <div class="absolute bottom-1 left-1 text-green-700" in:fly={{ y: 20 }}>
          {$_('ui.clipboard_copied')}
        </div>
      {/if}
    </div>

    <div class="mt-2 flex w-max gap-2 overflow-x-auto">
      <Button onclick={() => copyParamURLToClipboard()}>
        {$_('ui.clipboard_copy')}
        <Copy class="ml-2 size-4" />
      </Button>

      <a href={urlWithCustomParams} target="_blank">
        <Button>
          {$_('ui.open_new_tab')}
          <ExternalLink class="ml-2 size-4" />
        </Button>
      </a>
    </div>
  {/if}
</div>
