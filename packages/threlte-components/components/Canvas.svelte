<script lang="ts">
  import { mdiInformation, mdiPause, mdiRestart } from '@mdi/js';

  import { DEG2RAD } from 'three/src/math/MathUtils';
  import {
    AmbientLight,
    Canvas,
    Mesh,
    OrbitControls,
    OrthographicCamera,
    PerspectiveCamera,
    useThrelte
  } from '@threlte/core';

  import { Sliders } from 'ui/utils/slider';
  import { RoundButton, ToggleFullscreen, Slider as SvelteSlider, UI } from 'ui';
  import { CircleGeometry, DoubleSide, MeshStandardMaterial, Vector3 } from 'three';

  export let enablePan = false;
  export let disableUI = false;
  export let sliders = new Sliders();
  export let title = '';
  export let autoPlay = false;
  export let isPerspectiveCamera = false;
  export let autoRotate = false;
  export let floor = false;
  export let camPos = new Vector3(3.5, 2.8, 3.5);
  export let camTarget = new Vector3(0, 0, 0);
  export let background = '#ffffff';

  let isPlaying = autoPlay;
  let isFullscreen = false;
  let showFormulas = false;

  let position = camPos;
  let target = camTarget;
  let zoom = 100;
  let height: number = 0;
  let width: number = 0;

  let sceneEl: HTMLDivElement;

  /**
   * Reset camera position, rotation and sliders.
   */
  function reset() {
    sliders = sliders.reset();

    position = new Vector3(3.5, 2.8, 3.5);
    target = new Vector3(0, 0, 0);
    zoom = 100;

    playScene();
  }

  function animate() {
    if (isPlaying) requestAnimationFrame(animate);

    // TODO: update scene
  }

  function playScene() {
    isPlaying = true;
    animate();
  }

  function pauseScene() {
    isPlaying = false;
    // TODO: pause scene
  }
</script>

<div
  bind:clientHeight={height}
  bind:clientWidth={width}
  bind:this={sceneEl}
  style="height:100%; background: {background}"
>
  <Canvas size={{ width, height }}>
    {#if isPerspectiveCamera}
      <PerspectiveCamera {position}>
        <OrbitControls
          minDistance={1}
          maxDistance={15}
          maxPolarAngle={DEG2RAD * 120}
          {autoRotate}
          {enablePan}
          {target}
        />
      </PerspectiveCamera>
    {:else}
      <!-- TODO: set zoom parameters -->
      <OrthographicCamera {position} {zoom} near={-10}>
        <OrbitControls
          enableDamping
          maxPolarAngle={DEG2RAD * 120}
          {autoRotate}
          {enablePan}
          {target}
        />
      </OrthographicCamera>
    {/if}

    <slot name="lights">
      <AmbientLight intensity={1} />
    </slot>

    <slot />

    {#if floor}
      <Mesh
        receiveShadow
        rotation={{ x: -90 * (Math.PI / 180) }}
        geometry={new CircleGeometry(5, 72)}
        material={new MeshStandardMaterial({
          side: DoubleSide,
          color: 'white',
          opacity: 0.5,
          transparent: true
        })}
      />
    {/if}
  </Canvas>

  {#if !disableUI}
    <!-- EXPLAIN PANEL -->
    <UI top left visible={title && isFullscreen && isPlaying}>
      {title}
    </UI>

    <UI top left visible={!isPlaying && !isFullscreen}>Click to start playing scene</UI>

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
    <UI column bottom right opacity styled={false}>
      {#if isPlaying}
        <RoundButton icon={mdiPause} on:click={pauseScene} />
      {/if}

      <!-- TODO: give this button function <RoundButton icon="{mdiCog}" on:click="{resize}" /> -->
      <RoundButton icon={mdiRestart} on:click={reset} />

      <ToggleFullscreen {sceneEl} bind:isFullscreen />
    </UI>
  {/if}
</div>
