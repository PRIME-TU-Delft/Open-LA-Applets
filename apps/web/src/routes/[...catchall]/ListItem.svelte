<script lang="ts">
  import { formatString } from '$lib/utils/FormatString';
  import { mdiArrowRight, mdiEye, mdiEyeOff } from '@mdi/js';
  import { Icon } from 'mdi-svelte-ts';
  import { fade } from 'svelte/transition';

  export let url = '';
  export let title = '';

  let showUrlIframe = '';

  function toggleUrlIframe(url: string) {
    showUrlIframe = showUrlIframe == url ? '' : url;
  }
</script>

<div in:fade class="flex gap-2 items-center">
  <button class="btn btn-secondary" on:click={() => toggleUrlIframe(url)}>
    {#if showUrlIframe == url}
      <Icon path={mdiEyeOff} />
    {:else}
      <Icon path={mdiEye} />
    {/if}
  </button>
  <a class="link-hover w-full bg-base-200 rounded p-4 flex justify-between items-center" href={url}>
    <div>{formatString(title)}</div>
    <Icon path={mdiArrowRight} />
  </a>
</div>

{#if showUrlIframe == url}
  <iframe
    {title}
    class="w-full h-96 bg-white rounded"
    src={url + '?iframe=true'}
    frameborder="0"
    allowfullscreen
  />
{/if}
