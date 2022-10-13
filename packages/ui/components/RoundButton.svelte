<script lang="ts">
  import { Icon } from 'mdi-svelte-ts';

  export let icon: string;
</script>

<div
  class="roundedButton rounded bg-slate-900 h-12 w-12 text-slate-200 grid items-center justify-center cursor-pointer"
  on:click
  on:keypress
>
  <Icon path="{icon}" size="{1.5}" />
</div>

<style>
  .roundedButton {
    scale: 1;
    transition: scale 0.3s;
  }

  .roundedButton:hover {
    scale: 1.1;
  }
</style>
