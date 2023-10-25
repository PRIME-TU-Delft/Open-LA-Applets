<script lang="ts">
  export let rounded = false;
</script>

<button class="btn" class:rounded on:click>
  <slot />
</button>
