<script lang="ts">
  import { useTask, useThrelte } from '@threlte/core';
  import { Grid, Sky, Stars } from '@threlte/extras';
  import { onMount } from 'svelte';
  import { Vector2 } from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

  export let elevation = 0;
  export let azimuth = 250;
  export let grid = true;

  const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();

  let bloomPass: UnrealBloomPass;
  let renderPass: RenderPass;

  const composer = new EffectComposer(renderer);
  const setupEffectComposer = (camera: THREE.Camera) => {
    if (bloomPass && renderPass) {
      composer.removePass(bloomPass);
      composer.removePass(renderPass);
    }

    renderPass = new RenderPass(scene, camera);
    bloomPass = new UnrealBloomPass(new Vector2(100, 100), 1, 0.5, 0.1);

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
  };
  $: setupEffectComposer($camera);
  $: composer.setSize($size.width, $size.height);

  onMount(() => {
    let before = autoRender.current;
    autoRender.set(false);
    return () => {
      if (bloomPass && renderPass) {
        composer.removePass(bloomPass);
        composer.removePass(renderPass);
      }

      autoRender.set(before);

      console.log('dismount');
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
