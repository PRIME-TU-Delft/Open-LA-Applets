<script lang="ts">
  import type Slider from '../utils/slider';

  export let slider: Slider;
</script>

<div class="flex items-center">
  <span class="mx-2 w-8 text-center" style="color: {slider.color}">{slider.value}</span>
  <input
    type="range"
    min="{slider.min}"
    max="{slider.max}"
    step="{slider.stepSize}"
    bind:value="{slider.value}"
    on:change
    style="--color: {slider.color}"
  />
</div>

<style>
  input {
    accent-color: var(--color);
  }
</style>
