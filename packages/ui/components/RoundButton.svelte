<script lang="ts">
  import { Icon } from 'mdi-svelte-ts';

  export let icon = '';
  export let size = 1;
  export let color = 'currentColor';
  export let disabled = false;
</script>

<div
  class="roundedButton rounded bg-slate-900 h-12 w-12 text-slate-200 grid items-center justify-center cursor-pointer"
  class:disabled
  on:click
  on:keypress
>
  <Icon path="{icon}" color="{color}" size="{size}" />
</div>

<style lang="postcss">
  .roundedButton {
    scale: 1;
    transition: scale 0.3s;
  }

  .roundedButton:hover {
    scale: 1.1;
    @apply bg-slate-800;
  }

  .disabled {
    @apply cursor-not-allowed text-slate-100/50;
  }
</style>
