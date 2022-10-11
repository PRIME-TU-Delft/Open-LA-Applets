<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { mdiCog, mdiRestart } from '@mdi/js';

  import {
    Color,
    PerspectiveCamera,
    OrthographicCamera,
    Scene,
    Vector3,
    WebGLRenderer
  } from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { sceneKey } from './utils/sceneKey';
  import type Slider from 'ui/components/utils/slider';

  import { RoundButton, ToggleFullscreen, Slider as SvelteSlider } from 'ui';

  export let enablePan = false;
  export let disableUI = false;
  export let sliders: readonly Slider[] = []; // Enfore with typescript 0 - 3 sliders

  let sceneEl: HTMLDivElement;
  let el: HTMLCanvasElement;
  let width: number; // Width of scene
  let height: number; // Height of scene

  const scene = new Scene(); // Global THREE scene
  let camera: PerspectiveCamera | OrthographicCamera; // Camera as perspective camera
  let renderer: WebGLRenderer; // Renderer as WebGL renderer
  let controls: OrbitControls; // Orbit controls - to pan arround the scene
  let camPos: Vector3 = new Vector3(3.5, 2.8, 3.5);

  const FRUSTRUM_SIZE = 10; // Size of the frustum

  $: sliderValues = sliders.map((s) => s.value);

  // Set context for all children to use the same scene
  setContext(sceneKey, {
    scene,
    sliderValues
  });

  /**
   * Resize canvas if window size changes.
   */
  function resize() {
    if (!camera || !renderer) return;

    if (camera.type == 'PerspectiveCamera') {
      // ensure camera is a perspective camera
      camera.aspect = width / height;
    } else {
      // ensure camera is an orthographic camera
      const aspect = width / height;
      camera.left = (-FRUSTRUM_SIZE * aspect) / 2;
      camera.right = (FRUSTRUM_SIZE * aspect) / 2;
      camera.top = FRUSTRUM_SIZE / 2;
      camera.bottom = -FRUSTRUM_SIZE / 2;
    }

    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  /**
   * Ubdate canvas with new information
   */
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    if (camera && camera.position.x != camPos.x) {
      camPos.copy(camera.position);
    }
  }

  /**
   * Reset camera position, rotation and sliders.
   */
  function reset() {
    sliders = sliders.map((slider) => slider.reset());
    camera.position.set(3.5, 2.8, 3.5);
    controls.update();
  }

  function setupPerspectiveCamera() {
    camera = new PerspectiveCamera(75, 1, 0.1, 1000);
  }

  function setupOrthographicCamera() {
    const aspect = width / height;
    camera = new OrthographicCamera(
      (FRUSTRUM_SIZE * aspect) / -2,
      (FRUSTRUM_SIZE * aspect) / 2,
      FRUSTRUM_SIZE / 2,
      FRUSTRUM_SIZE / -2,
      -10, // black magic fuckery,
      100
    );
  }

  function createScene() {
    scene.background = new Color('#ffffff');
    renderer = new WebGLRenderer({ antialias: true, canvas: el });
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = enablePan;
    controls.maxDistance = 10;
    controls.minDistance = 1;
    controls.maxZoom = 20;
    controls.minZoom = 1;

    reset();
    resize();
    animate();
  }

  // Switch between perspective and orthographic camera
  function togglePerspective() {
    if (camera.type == 'PerspectiveCamera') {
      setupOrthographicCamera();
    } else {
      setupPerspectiveCamera();
    }

    createScene();
  }

  onMount(() => {
    setupPerspectiveCamera();

    createScene();
  });
</script>

<svelte:window bind:innerWidth="{width}" bind:innerHeight="{height}" on:resize="{resize}" />
<div bind:this="{sceneEl}">
  <canvas bind:this="{el}"></canvas>

  <!-- Explain panel -->
  <div
    class="fixed px-4 m-4 h-12 top-2 bg-slate-900 rounded flex gap-2 justify-center items-center text-slate-100"
  >
    <slot scene="{scene}" camera="{camera}" sliderValues="{sliderValues}" />
  </div>

  <!-- Slider Panel -->
  {#if !disableUI && sliders.length > 0 && sliders.length <= 3}
    <div class="fixed right-20 bottom-4 px-4 rounded h-12 bg-slate-900 flex justify-end">
      {#each sliders as slider}
        <SvelteSlider bind:slider />
      {/each}
    </div>
  {/if}

  <!-- Options panel -->
  <div class="fixed right-4 bottom-4 w-12 flex flex-col gap-2">
    <RoundButton icon="{mdiCog}" on:click="{togglePerspective}" />
    <RoundButton icon="{mdiRestart}" on:click="{reset}" />

    <ToggleFullscreen resize="{resize}" sceneEl="{sceneEl}" />
  </div>
</div>
