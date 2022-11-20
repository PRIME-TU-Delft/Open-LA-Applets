<script lang="ts">
  import { Icon } from 'mdi-svelte-ts';

  export let icon = '';
  export let size = 1;
  export let color = 'currentColor';
  export let disabled = false;
</script>

<div
  class="roundedButton grid h-12 w-12 cursor-pointer items-center justify-center "
  class:disabled
  on:click
  on:keypress
>
  <Icon path={icon} {color} {size} />
</div>

<style lang="postcss">
  .roundedButton {
    scale: 1;
    transition-duration: 0.3s;
    transition-property: scale, background-color, opacity, color;
    @apply rounded border-2 border-slate-900 bg-slate-700/40 px-4 py-2 text-slate-50;
  }

  .roundedButton:hover {
    scale: 1.1;
    @apply bg-slate-900 text-slate-100 opacity-100;
  }

  .disabled {
    @apply cursor-not-allowed text-slate-100/50;
  }
</style>
