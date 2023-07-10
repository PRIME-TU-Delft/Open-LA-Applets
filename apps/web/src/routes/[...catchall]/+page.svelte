<script lang="ts">
  import { mdiClose } from '@mdi/js';
  import { Icon } from 'mdi-svelte-ts';
  import { fly } from 'svelte/transition';
  import FilterList from './FilterList.svelte';
  import FolderList from './FolderList.svelte';

  const modules = import.meta.glob('$routes/applet/**/+page.svelte');

  let searchInput: HTMLInputElement;
  let searchQuery = 'line';

  $: fileUrls = Object.keys(modules).map((rawUrl) =>
    // Remove head of path and extension
    rawUrl.replace('/src/routes/applet/', '').replace('/+page.svelte', '')
  );

  function handleKeyDown(e: KeyboardEvent) {
    // If cmd+k is pressed, focus search input
    if (e.key == 'k' && e.metaKey) searchInput.focus();
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="top-0 w-full sticky p-4 bg-base-300/70 z-50 backdrop-blur flex justify-between">
  <div class="prose">
    <h1>Applets</h1>
  </div>
  <form class="flex gap-2">
    <div class="relative">
      <input
        bind:this={searchInput}
        type="text"
        placeholder="Enter applet name"
        class="input input-bordered w-full max-w-xs"
        bind:value={searchQuery}
      />
      <div class="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
        <kbd class="kbd kbd-sm">⌘</kbd>
        <kbd class="kbd kbd-sm">k</kbd>
      </div>
    </div>
    {#if searchQuery}
      <button
        transition:fly={{ x: 10 }}
        on:click={() => (searchQuery = '')}
        class="btn btn-primary"
      >
        <Icon path={mdiClose} />
      </button>
    {/if}
  </form>
</div>

{#if searchQuery}
  <FilterList {fileUrls} {searchQuery} />
{:else}
  <FolderList {fileUrls} />
{/if}

<div class="container" />
