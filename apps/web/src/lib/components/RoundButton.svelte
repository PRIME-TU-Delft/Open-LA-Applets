<script>
  import { Icon } from 'mdi-svelte-ts';

  export let icon = '';
  export let size = 1;
  export let color = 'currentColor';
  export let disabled = false;
</script>

<button class="btn flex flex-col justify-center" class:disabled on:click on:keypress>
  <Icon path={icon} {color} {size} />
</button>

<style lang="postcss">
  button {
    scale: 1;
    transition: scale 0.3s;
  }

  button:hover {
    scale: 1.1;
  }
</style>
