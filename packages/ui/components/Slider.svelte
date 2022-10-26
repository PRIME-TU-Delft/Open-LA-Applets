<script lang="ts">
  import type Slider from '../utils/slider';

  export let slider: Slider;
</script>

<input
  type="range"
  min="{slider.min}"
  max="{slider.max}"
  step="{slider.step}"
  bind:value="{slider.value}"
  on:change
  style="--color: {slider.color}"
/>

<style>
  input {
    accent-color: var(--color);
  }
</style>
