<script lang="ts">
  import { onMount } from 'svelte';

  let fps = $state(0);
  let frameCount = $state(0);
  let lastTime = $state(0);
  let animationId: number;

  function updateFPS(currentTime: number) {
    frameCount++;
    
    if (currentTime - lastTime >= 1000) { // Update every second
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;
    }
    
    animationId = requestAnimationFrame(updateFPS);
  }

  onMount(() => {
    lastTime = performance.now();
    animationId = requestAnimationFrame(updateFPS);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });
</script>

<div class="absolute bottom-2 right-2 z-50 rounded bg-black/75 px-2 py-1 text-xs text-white font-mono">
  FPS: {fps}
</div>
