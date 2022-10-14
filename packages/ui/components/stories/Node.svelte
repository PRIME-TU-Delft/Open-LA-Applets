<script lang="ts">
	import type { Route } from "$lib/types/Routes";
	import { mdiFolder } from "@mdi/js";
	import { Icon } from "mdi-svelte-ts";
	import Leaf from "./Leaf.svelte";

  export let route: Route;
  export let url = ""
  export let home = ""

  function closeChildren(r: Route) {
    r.isExpanded = false;

    if (r.children) {
      r.children = r.children.map(c => {c.isExpanded = false; return c})
    }

    return r;
  }

  function toggleFolder() {
    // TODO: do recursive

    if (route.isExpanded) {
      route = closeChildren(route); 
    } else {
      route.isExpanded = true
    }

  }
</script>

<div class="font-mono bold cursor-pointer capitalize select-none">
  <span class="flex gap-2 items-center" on:click={toggleFolder}><Icon path={mdiFolder} />{route.url}</span>

  {#if route.isExpanded && route.children}
    <div class="p-2 pb-0 flex flex-col gap-2">
      {#each route.children as r}
        {#if r.children}
          <svelte:self {home} route={r} url={url + "/" + r.url} on:close />
        {:else}
          <Leaf {home} route={r} url={url + "/" + r.url} on:close /> 
        {/if}
      {/each}
    </div>
  {/if}
</div>