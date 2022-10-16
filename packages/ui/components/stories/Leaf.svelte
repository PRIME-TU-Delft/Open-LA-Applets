<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { Route } from '$lib/types/Routes';

  const dispatch = createEventDispatcher();

  export let route: Route;
  export let url = '';
  export let home = '';

  $: href = home ? '/' + home + '/' + url : '/' + url;

  function gotoRoute() {
    dispatch('close');
  }
</script>

<a href="{href}" class="cursor-pointer select-none capitalize" on:click="{gotoRoute}">
  {route.url}
</a>
