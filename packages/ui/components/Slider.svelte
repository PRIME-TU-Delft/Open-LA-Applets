<script lang="ts">
  import { type Slider } from 'utils/Slider';

  export let slider: Slider;
</script>

<input
  type="range"
  min={slider.min}
  max={slider.max}
  step={slider.stepSize}
  bind:value={slider.value}
  on:change
  on:mouseup
  on:mousedown
  style="--color: {slider.color}"
/>

<style>
  input {
    accent-color: var(--color);
  }
</style>
