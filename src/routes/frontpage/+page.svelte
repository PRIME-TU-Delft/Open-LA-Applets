<script>
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';

  let elevation = -2;
  let azimuth = 180;
  let grid = true;
</script>

<div class="hidden absolute left-4 top-4">
  <label class="text-black" for="elevation">
    elevation: {elevation}
    <input type="range" bind:value={elevation} min={-3} max={10} />
  </label>
  <input type="range" bind:value={azimuth} min={0} max={360} />

  <input type="checkbox" name="grid" bind:checked={grid} />
</div>

<div class="h-full w-full">
  <Canvas>
    <Scene {elevation} {azimuth} {grid} />
  </Canvas>
</div>
