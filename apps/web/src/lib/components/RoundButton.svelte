<script lang="ts">
  import { Icon } from 'mdi-svelte-ts';
  import { twMerge } from 'tailwind-merge';

  export let twClass = '';
  export let icon = '';
  export let size = 1;
  export let color = 'currentColor';
  export let disabled = false;

  $: classes = twMerge('btn flex flex-col justify-center', twClass);
</script>

<button class={classes} class:disabled on:click on:keypress>
  <Icon path={icon} {color} {size} />
</button>

<style lang="postcss">
  button {
    background: var(--bg);
    scale: 1;
    transition: scale 0.3s;
  }

  button:hover {
    background: var(--bg);
    scale: 1.1;
  }
</style>
