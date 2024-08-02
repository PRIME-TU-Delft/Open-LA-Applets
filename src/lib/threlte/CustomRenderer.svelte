<script lang="ts">
  import { useTask, useThrelte, watch } from '@threlte/core';
  import { Grid, Sky, Stars } from '@threlte/extras';
  import { onMount } from 'svelte';
  import { Vector2 } from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

  type CustomRendererProps = {
    elevation?: number;
    azimuth?: number;
    grid?: boolean;
  };

  let { elevation = 0, azimuth = 250, grid = true }: CustomRendererProps = $props();

  const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();

  const composer = new EffectComposer(renderer);

  $effect(() => {
    composer.setSize($size.width, $size.height);
  });

  onMount(() => {
    const before = autoRender.current;
    autoRender.set(false);

    const renderPass = new RenderPass(scene, $camera);
    const bloomPass = new UnrealBloomPass(new Vector2(100, 100), 1, 0.5, 0.1);

    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    return () => {
      if (bloomPass && renderPass) {
        composer.removePass(bloomPass);
        composer.removePass(renderPass);
      }

      autoRender.set(before);
    };
  });

  useTask(
    (delta) => {
      composer.render(delta);
    },
    { stage: renderStage, autoInvalidate: false }
  );
</script>

<Sky {elevation} {azimuth} setEnvironment={true} />

<Stars opacity={1} count={10000} radius={8} factor={10} />

{#if grid}
  <Grid
    position.y={-0.001}
    cellColor="#c084fc"
    sectionColor="#e9d5ff"
    fadeDistance={50}
    cellSize={2}
    infiniteGrid
  />
{/if}
