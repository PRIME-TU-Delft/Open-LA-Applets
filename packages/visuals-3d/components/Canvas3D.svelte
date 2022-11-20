<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { mdiInformation, mdiPause, mdiRestart } from '@mdi/js';

  import {
    Color,
    PerspectiveCamera,
    OrthographicCamera,
    Scene,
    Vector3,
    WebGLRenderer
  } from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { sceneKey } from 'utils/SceneKey';
  import { CSS2DRenderer } from 'utils/CSS2DRenderer';

  import { Sliders } from 'utils/Slider';

  import { RoundButton, ToggleFullscreen, Slider as SvelteSlider, UI } from 'ui';

  export let enablePan = false;
  export let disableUI = false;
  export let sliders = new Sliders();
  export let title = '';
  export let autoPlay = false;
  export let isPerspectiveCamera = true;

  let sceneEl: HTMLDivElement;
  let canvasEl: HTMLCanvasElement;
  let labelEl: HTMLDivElement;
  let width: number; // Width of scene
  let height: number; // Height of scene
  let isPlaying = autoPlay;
  let isFullscreen = false;
  let showFormulas = false;

  const scene = new Scene(); // Global THREE scene
  let camera: PerspectiveCamera | OrthographicCamera; // Camera as perspective camera
  let renderer: WebGLRenderer; // Renderer as WebGL renderer
  let labelRenderer: CSS2DRenderer; // Renderer for labels
  let controls: OrbitControls; // Orbit controls - to pan arround the scene
  let camPos: Vector3 = new Vector3(3.5, 2.8, 3.5);

  const FRUSTRUM_SIZE = 10; // Size of the frustum

  $: aspect = height > 0 ? width / height : 1; // Aspect ratio of the scene
  $: sliderValues = sliders.sliders.map((s) => s.value);

  // Set context for all children to use the same scene
  setContext(sceneKey, {
    scene,
    sliderValues
  });

  /**
   * Resize canvas if window size changes.
   */
  function resize() {
    if (!camera || !renderer || !labelRenderer) return;

    if (camera.type == 'PerspectiveCamera') {
      // ensure camera is a perspective camera
      camera.aspect = aspect;
    } else {
      camera.left = (-FRUSTRUM_SIZE * aspect) / 2;
      camera.right = (FRUSTRUM_SIZE * aspect) / 2;
      camera.top = FRUSTRUM_SIZE / 2;
      camera.bottom = -FRUSTRUM_SIZE / 2;
    }

    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    labelRenderer.setSize(width, height);

    update();
  }

  /**
   * Update canvas once with new information
   */
  function update() {
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);

    if (camera && camera.position.x != camPos.x) {
      camPos.copy(camera.position);
    }
  }

  /**
   * Update the canvas each frame if playing is true
   */
  function animate() {
    if (isPlaying) requestAnimationFrame(animate);

    update();
  }

  /**
   * Reset camera position, rotation and sliders.
   */
  function reset() {
    sliders = sliders.reset(); // could be faulty
    camera.position.set(3.5, 2.8, 3.5);
    controls.update();
    resize();
  }

  function setupPerspectiveCamera() {
    camera = new PerspectiveCamera(75, 1, 0.1, 1000);
  }

  function setupOrthographicCamera() {
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
    renderer = new WebGLRenderer({ antialias: true, canvas: canvasEl });
    renderer.setPixelRatio(window.devicePixelRatio);

    // Render layer for displaying 2d text in a 3d scene
    labelRenderer = new CSS2DRenderer({ element: labelEl });
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.className = 'labelRenderer';
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    // document.body.prepend(labelRenderer.domElement);

    controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enablePan = enablePan;
    controls.maxDistance = 15;
    controls.minDistance = 1;
    controls.maxZoom = 30;
    controls.minZoom = 1;

    reset();
    animate();
    resize();
  }

  function playScene() {
    isPlaying = true;
    animate();
  }

  function pauseScene() {
    isPlaying = false;
  }

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      // TODO: add throttle to make sure is it not called to often
      resize();
    });

    resizeObserver.observe(sceneEl);

    // This callback cleans up the observer

    if (isPerspectiveCamera) {
      setupPerspectiveCamera();
    } else {
      setupOrthographicCamera();
    }

    createScene();

    // Remove observer onDestroy
    return () => resizeObserver.unobserve(sceneEl);
  });
</script>

<div
  class="wrapper"
  bind:clientWidth={width}
  bind:clientHeight={height}
  bind:this={sceneEl}
  style="height: var(--height, 100vh); width: 100%; position: relative;"
>
  <div class="labelEl" bind:this={labelEl} />

  <div>
    {#if !isPlaying}
      <div
        class="absolute h-full w-full cursor-pointer bg-slate-900/50"
        on:click={playScene}
        on:keydown={playScene}
      />
    {/if}

    <canvas bind:this={canvasEl} />

    <slot {scene} {camera} {sliderValues} />

    {#if !disableUI}
      <!-- EXPLAIN PANEL -->
      <UI top left visible={title && isFullscreen && isPlaying}>
        {title}
      </UI>

      <UI top left styled visible={!isPlaying && !isFullscreen}>Click to start playing scene</UI>

      <!-- SLIDER PANEL -->
      <UI visible={!!sliders.sliders.length} bottom opacity>
        {#each sliders.sliders as slider}
          <SvelteSlider bind:slider on:change={playScene} />
        {/each}
      </UI>

      <!-- INFORMATION UI -->
      <UI visible={!!$$slots.formulas} top right styled={false} opacity={!showFormulas}>
        <RoundButton icon={mdiInformation} on:click={() => (showFormulas = !showFormulas)} />
      </UI>

      <UI visible={!!$$slots.formulas && showFormulas} top column>
        <h2 class="w-full border-b-2 border-slate-700 pb-1 font-bold">Prime visuals</h2>
        <slot name="formulas" />
      </UI>

      <!--  -->
      <UI column bottom right styled={false}>
        {#if isPlaying}
          <RoundButton icon={mdiPause} on:click={pauseScene} />
        {/if}

        <!-- TODO: give this button function <RoundButton icon="{mdiCog}" on:click="{resize}" /> -->
        <RoundButton icon={mdiRestart} on:click={reset} />

        <ToggleFullscreen {resize} {sceneEl} bind:isFullscreen />
      </UI>
    {/if}
  </div>
</div>
