<script lang="ts">
  import { formatString } from '$lib/utils/FormatString';
  import { mdiArrowRight, mdiEye, mdiEyeOff } from '@mdi/js';
  import Icon from '$lib/components/Icon.svelte';
  import { fade } from 'svelte/transition';
  import * as Button from '$lib/components/ui/button';

  export let url = '';
  export let title = '';
  export let subtitle = '';

  let showUrlIframe = '';

  function toggleUrlIframe(url: string) {
    showUrlIframe = showUrlIframe == url ? '' : url;
  }
</script>

<div in:fade class="flex gap-2 items-center">
  {#if showUrlIframe == url}
    <Button.Root class="h-12 bg-blue-400 hover:bg-blue-900" on:click={() => toggleUrlIframe(url)}>
      <Icon path={mdiEyeOff} />
    </Button.Root>
  {:else}
    <Button.Root class="h-12 bg-blue-900" on:click={() => toggleUrlIframe(url)}>
      <Icon path={mdiEye} />
    </Button.Root>
  {/if}
  <a
    class="link-hover w-full bg-slate-200 rounded p-4 flex justify-between items-center"
    href={url}
  >
    <div>
      <span class="text-slate-500 text-sm">
        {formatString(subtitle)} /
      </span>
      <span>
        {formatString(title)}
      </span>
    </div>
    <Icon path={mdiArrowRight} />
  </a>
</div>

{#if showUrlIframe == url}
  <iframe
    {title}
    class="w-full h-[30rem] bg-white rounded"
    src={url + '?iframe=true'}
    frameborder="0"
    allowfullscreen
  />
{/if}
