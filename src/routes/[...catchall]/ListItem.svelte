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

<div in:fade class="flex gap-2 items-center">
  {#if showUrlIframe == url}
    <Button.Root class="h-12 bg-blue-400 hover:bg-blue-900" onclick={() => toggleUrlIframe(url)}>
      <EyeOff class="w-4 h-4" />
    </Button.Root>
  {:else}
    <Button.Root class="h-12 bg-blue-900" onclick={() => toggleUrlIframe(url)}>
      <Eye class="w-4 h-4" />
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
    <ArrowRight />
  </a>
</div>

{#if showUrlIframe == url}
  <iframe
    {title}
    class="w-full h-[30rem] bg-white rounded"
    src={url + '?iframe=true'}
    frameborder="0"
    allowfullscreen
  ></iframe>
{/if}
