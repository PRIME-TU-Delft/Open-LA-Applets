<script lang="ts">
  import type { DocsRoute } from 'utils';
  import { mdiFolder } from '@mdi/js';
  import { Icon } from 'mdi-svelte-ts';
  import Leaf from './Leaf.svelte';

  export let route: DocsRoute;
  export let url = '';
  export let home = '';

  function closeChildren(r: DocsRoute) {
    r.isExpanded = false;

    if (r.children) {
      r.children = r.children.map((c) => {
        c.isExpanded = false;
        return c;
      });
    }

    return r;
  }

  function toggleFolder() {
    // TODO: do recursive

    if (route.isExpanded) {
      route = closeChildren(route);
    } else {
      route.isExpanded = true;
    }
  }
</script>

<div class="bold cursor-pointer select-none font-mono capitalize">
  <span class="flex items-center gap-2" on:keydown={toggleFolder} on:click={toggleFolder}
    ><Icon path={mdiFolder} />{route.url}</span
  >

  {#if route.isExpanded && route.children}
    <div class="flex flex-col gap-2 p-2 pb-0">
      {#each route.children as r}
        {#if r.children}
          <svelte:self {home} route={r} url={url + '/' + r.url} on:close />
        {:else}
          <Leaf {home} route={r} url={url + '/' + r.url} on:close />
        {/if}
      {/each}
    </div>
  {/if}
</div>
