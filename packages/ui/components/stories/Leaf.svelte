<script lang="ts">
  import { createEventDispatcher } from 'svelte';

	import { goto } from "$app/navigation";
	import type { Route } from "$lib/types/Routes";

	const dispatch = createEventDispatcher();

  export let route: Route;
  export let url = ""
  export let home = ""

  function gotoRoute() {
    goto("/" + home + "/" + url)

    dispatch('close')
  }
</script>

<div class="cursor-pointer capitalize select-none" on:click={gotoRoute}>{route.url}</div>