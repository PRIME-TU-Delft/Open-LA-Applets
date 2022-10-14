<script lang="ts">
  import { mdiBookOpen, mdiClose, mdiFileSettingsOutline, mdiMagnify } from '@mdi/js';
  import { goto } from '$app/navigation';
  import type { Route } from './Routes';

  import Node from './Node.svelte';
  import Leaf from './Leaf.svelte';
  import Button from '../RoundButton.svelte';

  export let home = '';
  export let routes: Route[] = [];

  let isRoutesVisible = false;
</script>

<nav class="fixed z-10 left-4 top-1/2 -translate-y-1/2 py-6 h-[40rem] max-h-full text-slate-100 ">
  <div class="bg-slate-900 h-full rounded-lg flex flex-col items-center overflow-auto pb-2">
    <Button icon="{mdiBookOpen}" size="{1.75}" on:click="{() => goto('/' + home)}" />
    <Button
      icon="{mdiFileSettingsOutline}"
      disabled="{!routes.length}"
      on:click="{() => (isRoutesVisible = !isRoutesVisible)}"
    />

    <!-- TODO: fuzzy search routes -->
    <Button icon="{mdiMagnify}" disabled />
    <!-- TODO: <Button icon={mdiCog} disabled />   -->
  </div>

  {#if isRoutesVisible}
    <div class="absolute z-10 top-0 left-16 p-4 my-6 rounded-xl bg-slate-900 h-full overflow-auto">
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

<main>
  <slot />
</main>

<style lang="postcss">
  :global(body) {
    @apply bg-slate-200 text-slate-900;
  }
</style>
