<script lang="ts">
  import Icon from './Icon.svelte';
  import { mdiMagnify } from '@mdi/js';

  export let value: string;
</script>

<div class="input">
  <input type="text" placeholder="Search icon" bind:value on:keyup />
  <span class="tail">
    <slot>
      <Icon path={mdiMagnify} size={1.5} />
    </slot>
  </span>
</div>

<style>
  .input {
    position: relative;
    display: grid;
    grid-template: 'container';
    width: 100%;
    border: 2px solid rgb(51, 65, 85);
    border-radius: 0.25rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }

  .tail {
    justify-self: end;
    align-self: center;
    padding-inline: 0.25rem;
  }

  input,
  .tail {
    grid-area: container;
  }
</style>
