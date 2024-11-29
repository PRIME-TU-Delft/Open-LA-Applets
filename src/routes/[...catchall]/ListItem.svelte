<script lang="ts">
  import * as Button from '$lib/components/ui/button';
  import { formatString } from '$lib/utils/FormatString';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
  import Eye from 'lucide-svelte/icons/eye';
  import EyeOff from 'lucide-svelte/icons/eye-off';
  import { fade } from 'svelte/transition';

  export let url = '';
  export let title = '';
  export let subtitle = '';

  let showUrlIframe = '';

  function toggleUrlIframe(url: string) {
    showUrlIframe = showUrlIframe == url ? '' : url;
  }
</script>

<div in:fade class="flex items-center gap-2">
  {#if showUrlIframe == url}
    <Button.Root class="h-12 bg-blue-400 hover:bg-blue-900" onclick={() => toggleUrlIframe(url)}>
      <EyeOff class="h-4 w-4" />
    </Button.Root>
  {:else}
    <Button.Root class="h-12 bg-blue-900" onclick={() => toggleUrlIframe(url)}>
      <Eye class="h-4 w-4" />
    </Button.Root>
  {/if}
  <a
    class="link-hover flex w-full items-center justify-between rounded bg-slate-200 p-4"
    href={url}
  >
    <div>
      <span class="text-sm text-slate-500">
        {formatString(subtitle)} /
      </span>
      <span>
        {formatString(title)}
      </span>
    </div>
    <ArrowRight />
  </a>
</div>

{#if showUrlIframe == url}
  <iframe
    {title}
    class="h-[30rem] w-full rounded bg-white"
    src={url + '?iframe=true'}
    frameborder="0"
    allowfullscreen
  ></iframe>
{/if}
