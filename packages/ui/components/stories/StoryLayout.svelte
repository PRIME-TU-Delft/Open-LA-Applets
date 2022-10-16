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
  top-inherit fixed left-4 bottom-0 z-10 max-h-full 
  w-full py-6 text-slate-100
  md:top-1/2 md:h-[40rem] md:w-[inherit] md:-translate-y-1/2
  "
>
  <div
    class="
      flex h-full items-center overflow-y-auto overflow-x-hidden rounded-lg bg-slate-900 pb-2
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
      top-inherit absolute  bottom-16 left-0 z-10 my-6 h-fit
      overflow-auto rounded-xl bg-slate-900 p-4
      md:top-0 md:left-16 md:h-full
      "
    >
      <div class="mb-2 flex w-60 items-center justify-between">
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
