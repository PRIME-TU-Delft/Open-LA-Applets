<script lang="ts">
  import { useTask, useThrelte } from '@threlte/core';
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
    stars?: boolean;
    bloomStrength?: number;
    bloomRadius?: number;
    bloomThreshold?: number;
  };

  let {
    elevation = 0,
    azimuth = 250,
    grid = true,
    stars = true,
    bloomStrength = 1,
    bloomRadius = 0.5,
    bloomThreshold = 0.1
  }: CustomRendererProps = $props();

  const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();

  const composer = new EffectComposer(renderer);

  $effect(() => {
    composer.setSize($size.width, $size.height);
  });

  onMount(() => {
    const before = autoRender.current;
    autoRender.set(false);

    const renderPass = new RenderPass(scene, $camera);
    const bloomPass = new UnrealBloomPass(
      new Vector2(100, 100),
      bloomStrength,
      bloomRadius,
      bloomThreshold
    );

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

{#if stars}
  <Stars opacity={1} count={10000} radius={8} factor={10} />
{/if}

{#if grid}
  <Grid
    position.y={-15.001}
    cellColor="#c084fc"
    sectionColor="#e9d5ff"
    fadeDistance={50}
    cellSize={2}
    infiniteGrid
  />
{/if}
