<script lang="ts">
  import { useTask, useThrelte } from '@threlte/core';
  import { onMount } from 'svelte';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
  import { Vector2 } from 'three';

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
