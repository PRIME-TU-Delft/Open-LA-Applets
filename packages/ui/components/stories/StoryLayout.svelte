<script lang="ts">
  import { mdiBookOpen, mdiClose, mdiFileSettingsOutline, mdiMagnify } from '@mdi/js';
  import { goto } from '$app/navigation';
  import type { Route } from './Routes';

  import Node from './Node.svelte';
  import Leaf from './Leaf.svelte';
  import Button from '../RoundButton.svelte';
  import SearchBar from './SearchBar.svelte';

  export let home = '';
  export let routes: Route[] = [];

  let isRoutesVisible = false;
  let isSearchVisible = false;
</script>

<nav
  class="
  fixed z-10 left-4 py-6 max-h-full text-slate-100 
  top-inherit bottom-0 w-full
  md:top-1/2 md:-translate-y-1/2 md:h-[40rem] md:w-[inherit]
  "
>
  <div
    class="
      bg-slate-900 h-full rounded-lg flex items-center overflow-x-hidden overflow-y-auto pb-2
    md:flex-col
      "
  >
    <Button icon="{mdiBookOpen}" size="{1.75}" on:click="{() => goto('/' + home)}" />
    <Button
      icon="{mdiFileSettingsOutline}"
      disabled="{!routes.length}"
      on:click="{() => (isRoutesVisible = !isRoutesVisible)}"
    />

    <Button icon="{mdiMagnify}" on:click="{() => (isSearchVisible = !isSearchVisible)}" />
    <!-- TODO: <Button icon={mdiCog} disabled />   -->
  </div>

  {#if isRoutesVisible}
    <div
      class="
      absolute z-10  p-4 my-6 rounded-xl bg-slate-900 overflow-auto
      top-inherit h-fit bottom-16 left-0
      md:top-0 md:left-16 md:h-full
      "
    >
      <div class="mb-2 w-60 flex justify-between items-center">
        <span class="text-xl">Routes</span>
        <Button icon="{mdiClose}" on:click="{() => (isRoutesVisible = false)}" />
      </div>

      <div class="flex flex-col gap-2">
        {#each routes as route}
          {#if route.children}
            <Node
              route="{route}"
              url="{route.url}"
              home="{home}"
              on:close="{() => {
                isRoutesVisible = false;
              }}"
            />
          {:else}
            <Leaf
              route="{route}"
              url="{route.url}"
              home="{home}"
              on:close="{() => {
                isRoutesVisible = false;
              }}"
            />
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</nav>

{#if isSearchVisible}
  <SearchBar routes="{routes}" on:close="{() => (isSearchVisible = false)}" />
{/if}

<main>
  <slot />
</main>

<style lang="postcss">
  :global(body) {
    @apply bg-slate-200 text-slate-900;
  }
</style>
