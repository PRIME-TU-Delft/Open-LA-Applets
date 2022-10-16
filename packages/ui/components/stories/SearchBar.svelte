<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import RoundButton from '../RoundButton.svelte';
  import type { Route } from 'util/Routes';

  import { mdiMagnify } from '@mdi/js';

  export let routes: Route[] = [];

  let searchQuery = '';
  let searchEl: HTMLInputElement;

  const dispatch = createEventDispatcher();

  /**
   * Flatten the three structure of the routes to a flat array and,
   * prefix all nested routes with its parent if front
   * [{url: "one", children: [{url: "two"}, {url: "three"}]}] to
   * {{url: "one", children: [...]}, {url: "one/two"}, {url: "one/three"}}
   *
   * @param routeList (Nested) Route array with nested children
   * @param urlPrefix url prefix of parent
   */
  function flattenRoutes(routeList: Route[], urlPrefix = ''): Route[] {
    routeList = routeList.reduce((acc, r) => {
      const thisUrl = r.url;

      if (!r.url.includes('/')) {
        r.url = urlPrefix + r.url;
      }

      acc = [...acc, r];

      if (r.children) {
        acc = acc.concat(flattenRoutes(r.children, thisUrl + '/'));
      }

      return acc;
    }, [] as Route[]);

    return routeList;
  }

  function filterRoutes(flatRoutes: Route[], query = '', limit = 5) {
    const filter = flatRoutes.filter((r) => {
      if (r.url?.includes(query.toLowerCase())) return true;
      if (r.name?.toLowerCase().includes(query.toLowerCase())) return true;

      return false;
    });

    console.log(filter);

    if (filter.length == 0) {
      return flatRoutes.slice(0, limit);
    }

    return filter.slice(0, limit);
  }

  $: flatRoutes = flattenRoutes(routes, '');
  $: filteredRoutes = filterRoutes(flatRoutes, searchQuery);

  function gotoFirst() {
    if (filterRoutes.length > 0) {
      goto('/' + filteredRoutes[0].url);
      closeSearch();
    }
  }

  function closeSearch() {
    dispatch('close');
  }

  // When mounted call focus on search element
  onMount(() => {
    if (!searchEl) return;
    searchEl.focus();
  });
</script>

<div
  class="fixed z-10 bg-slate-500/10 h-full w-full cursor-pointer backdrop-filter backdrop-blur-sm px-6 md:px-20"
  on:click="{closeSearch}"
  on:keydown
>
  <div
    class="mt-[15vmin] mx-auto left-0 h-16 w-full max-w-full md:max-w-2xl flex flex-col gap-2"
    on:click|stopPropagation
    on:keydown|stopPropagation
  >
    <!-- SEARCH BAR -->
    <div class="searchbar bg-white rounded">
      <input
        type="text"
        class="w-full h-full outline-none p-3 rounded"
        placeholder="Search for an article"
        bind:this="{searchEl}"
        bind:value="{searchQuery}"
      />

      <div class="searchIcon">
        <RoundButton icon="{mdiMagnify}" on:click="{gotoFirst}" />
      </div>
    </div>

    {#each filteredRoutes as route}
      <a
        href="/{route.url}"
        class="p-3 flex justify-between items-center rounded transition bg-white hover:bg-slate-100 first-of-type:bg-slate-400"
      >
        <span class="text-slate-900">{route.name || route.url}</span>

        {#if route.name}
          <span class="text-slate-300 text-sm">/{route.url}</span>
        {/if}
      </a>
    {/each}
  </div>
</div>

<style>
  .searchbar {
    display: grid;
    grid-template-areas: '🔍';
  }

  .searchbar > * {
    grid-area: 🔍;
  }

  .searchbar > .searchIcon {
    justify-self: end;
  }
</style>
