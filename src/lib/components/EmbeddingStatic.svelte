<script lang="ts">
  import { page } from '$app/state';
  import Copy from '@lucide/svelte/icons/copy';
  import ExternalLink from '@lucide/svelte/icons/external-link';
  import Download from '@lucide/svelte/icons/download';
  import { fly } from 'svelte/transition';
  import Button from './ui/button/button.svelte';
  import { Checkbox } from './ui/checkbox';
  import { Label } from './ui/label';
  import Textarea from './ui/textarea/textarea.svelte';
  import { _ } from 'svelte-i18n';
  import { getScreenshotName } from '$lib/screenshots/utils';
  import { resolve } from '$app/paths';

  let showCopySucess = $state(false);
  let includeQR = $state(true);

  const screenshotImage: `/${string}` = $derived(
    ('/' + getScreenshotName(page.url.pathname)) as `/${string}`
  );

  const stateUrl: `/${string}` = $derived.by(() => {
    const url = new URL(page.url.origin + page.url.pathname + '/static');

    if (includeQR) {
      url.searchParams.set('qr', 'true');
    }

    return url.toString() as `/${string}`;
  });

  function copyToClipboard() {
    navigator.clipboard.writeText(stateUrl);

    showCopySucess = true;

    setTimeout(() => {
      showCopySucess = false;
    }, 2000);
  }
</script>

<div class="mb-4 flex items-center gap-2">
  <Checkbox id="include-qr" bind:checked={includeQR} />
  <Label
    for="include-qr"
    class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    <span>{$_('embed_include_qr')}</span>
  </Label>
</div>

<Label
  for="url-state"
  class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
>
  {$_('embed_static_url')}
</Label>

<div class="relative h-full w-full">
  <Textarea readonly value={stateUrl} />
  {#if showCopySucess}
    <div class="absolute bottom-1 left-1 text-green-700" in:fly={{ y: 20 }}>
      {$_('clipboard_copied')}
    </div>
  {/if}
</div>

<div class="mt-2 flex gap-2 overflow-x-auto">
  <Button onclick={() => copyToClipboard()}>
    {$_('clipboard_copy')}
    <Copy class="ml-2 size-4" />
  </Button>

  <a href={resolve(stateUrl)} target="_blank">
    <Button>
      {$_('open_new_tab')}
      <ExternalLink class="ml-2 size-4" />
    </Button>
  </a>

  <a href={resolve(screenshotImage)} download target="_blank">
    <Button>
      {$_('download_image')}

      <Download />
    </Button>
  </a>
</div>
