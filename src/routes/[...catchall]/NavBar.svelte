<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import Input from '$lib/components/ui/input/input.svelte';
  import { debounce } from '$lib/utils/timeDelay';
  import { mdiClose } from '@mdi/js';
  import { fly } from 'svelte/transition';

  export let searchQuery = '';
  export let url: URL;

  let searchInput: HTMLInputElement;

  let search = debounce(() => {
    searchInput.focus();
    searchInput.setSelectionRange(searchQuery.length, searchQuery.length);

    url.searchParams.set('q', searchQuery);
    searchInput.focus();
    searchInput.setSelectionRange(searchQuery.length, searchQuery.length);
  }, 2000);

  function handleKeyDown(e: KeyboardEvent) {
    // If cmd+k is pressed, focus search input
    if (e.key == 'k' && e.metaKey) searchInput.focus();
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<nav class="sticky top-0 z-50 flex w-full justify-between bg-slate-100 p-4 backdrop-blur">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="https://www.tudelft.nl/">TU Delft</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link
          href="https://www.tudelft.nl/ewi/over-de-faculteit/afdelingen/applied-mathematics"
        >
          DIAM
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link
          href="https://www.tudelft.nl/ewi/over-de-faculteit/afdelingen/applied-mathematics/studeren/prime"
        >
          PRIME
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="https://prime.pages.ewi.tudelft.nl/openlabook-published/index.html">
          Open LA book
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Interactive Applets</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <form class="flex gap-2">
    <div class="relative">
      <Input
        bind:el={searchInput}
        type="text"
        placeholder="Enter applet name"
        class="input input-bordered w-full max-w-xs"
        bind:value={searchQuery}
        on:keyup={() => search()}
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
</nav>
