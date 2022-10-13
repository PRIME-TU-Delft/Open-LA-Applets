<script lang="ts">
  import type Slider from '../utils/slider';

  export let slider: Slider; // Enfore with typescript 0 - 3 sliders
</script>

<input
  type="range"
  min="{slider.min}"
  max="{slider.max}"
  step="{slider.step}"
  bind:value="{slider.value}"
  style="--color: {slider.color}"
/>

<style>
  input {
    accent-color: var(--color);
  }
</style>
