<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { DocsRoute } from 'utils';

  const dispatch = createEventDispatcher();

  export let route: DocsRoute;
  export let url = '';
  export let home = '';

  $: href = home ? '/' + home + '/' + url : '/' + url;

  function gotoRoute() {
    dispatch('close');
  }
</script>

<a {href} class="cursor-pointer select-none capitalize" on:click={gotoRoute}>
  {route.url}
</a>
