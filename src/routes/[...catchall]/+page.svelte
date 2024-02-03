<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { mdiClose } from '@mdi/js';
  import Icon from '$lib/components/Icon.svelte';
  import { fly } from 'svelte/transition';
  import { debounce } from '$lib/utils/timeDelay';
  import FilterList from './FilterList.svelte';
  import FolderList from './FolderList.svelte';

  const modules = import.meta.glob('$routes/applet/**/+page.svelte');

  const url = $page?.url;
  let searchInput: HTMLInputElement;
  let searchQuery = url.searchParams.get('q') || '';

  let contributors = [
    { name: 'Abel de Bruijn', title: 'Developer' },
    { name: 'Julia van der Kris', title: 'Developer' },
    { name: 'Christophe Smet', title: 'Teacher' },
    { name: 'Fokko van de Bult', title: 'Teacher' },
    { name: 'Teun Janssen', title: 'Teacher' },
    { name: 'Beryl van Gelderen', title: 'Cooridinator' }
  ];

  $: fileUrls = Object.keys(modules).map((rawUrl) =>
    // Remove head of path and extension
    rawUrl.replace('/src/routes/applet/', '').replace('/+page.svelte', '')
  );

  function handleKeyDown(e: KeyboardEvent) {
    // If cmd+k is pressed, focus search input
    if (e.key == 'k' && e.metaKey) searchInput.focus();
  }

  let search = debounce(async () => {
    searchInput.focus();
    searchInput.setSelectionRange(searchQuery.length, searchQuery.length);

    url.searchParams.set('q', searchQuery);
    await goto(url, { replaceState: true });
    searchInput.focus();
    searchInput.setSelectionRange(searchQuery.length, searchQuery.length);
  }, 2000);
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="sticky top-0 z-50 flex w-full justify-between bg-base-300/70 p-4 backdrop-blur">
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
        on:keyup={async () => {
          await search();

          searchInput.setSelectionRange(searchQuery.length, searchQuery.length);
        }}
      />
      <div class="absolute right-1 top-1/2 flex -translate-y-1/2 gap-1">
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

<div class="mx-auto max-w-2xl p-10">
  {#if searchQuery}
    <FilterList {fileUrls} bind:searchQuery />
  {:else}
    <FolderList {fileUrls} />
  {/if}

  <div
    class="container mx-auto my-10 box-border flex flex-col gap-2 rounded-lg border border-base-300 bg-base-200 p-4"
  >
    <div class="prose">
      <h2>Credits</h2>
      <p>
        These applets were created for the
        <a href="https://dbalague.pages.ewi.tudelft.nl/openlabook">
          TU Delft Open Linear Algebra book
        </a>
      </p>

      <h3>Contributors</h3>
      <div class="flex w-full flex-wrap justify-between gap-2">
        {#each contributors as { name, title }}
          <div class="flex gap-2">
            <div class="not-prose w-24 overflow-hidden rounded">
              <img
                class="aspect-square object-cover"
                src={'/contributors/' + name + '.jpg'}
                alt={'Profile of ' + name}
              />
            </div>
            <div class="flex flex-col gap-1">
              <span class="bold">{name}</span>
              <span class="text-xs">{title}</span>
            </div>
          </div>
        {/each}
      </div>

      <h3>License</h3>
      <p>
        <a class="not-prose" rel="license" href="http://creativecommons.org/licenses/by/4.0/"
          ><img
            alt="Creative Commons License"
            style="border-width:0"
            src="https://i.creativecommons.org/l/by/4.0/88x31.png"
          /></a
        ><br /><span>PRIME Linear Algebra applets</span>
        by
        <a
          href="https://www.tudelft.nl/ewi/over-de-faculteit/afdelingen/applied-mathematics/studeren/prime"
          property="cc:attributionName"
          rel="cc:attributionURL">PRIME, TU Delft</a
        >
        is licensed under a
        <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"
          >Creative Commons Attribution 4.0 International License</a
        >.<br />Based on a work at
        <a href="https://github.com/PRIME-TU-Delft/turborepo-visuals" rel="dct:source"
          >https://github.com/PRIME-TU-Delft/turborepo-visuals</a
        >.<br />Permissions beyond the scope of this license may be available at
        <a
          href="https://github.com/PRIME-TU-Delft/turborepo-visuals/blob/main/LICENSE"
          rel="cc:morePermissions"
          >https://github.com/PRIME-TU-Delft/turborepo-visuals/blob/main/LICENSE</a
        >.
      </p>
    </div>
  </div>

  <div class="rounded bg-slate-300 p-10">
    <img class="h-20 w-full object-contain" alt="prime-tudelft" src="/logo-black.png" />
  </div>
</div>
