<script lang="ts">
  import { type Slider } from 'utils/Slider';

  export let slider: Slider;
</script>

<label>
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
</label>

<style>
  label {
    display: grid;
  }

  input {
    accent-color: var(--color);
  }
</style>
