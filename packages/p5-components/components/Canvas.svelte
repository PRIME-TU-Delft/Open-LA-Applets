<script lang="ts">
  import { mdiRestart } from '@mdi/js';
  import type p5 from 'p5';
  import { P5 } from 'p5-svelte';
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { RoundButton, Slider as SvelteSlider, ToggleFullscreen, UI } from 'ui';
  import { Sliders } from 'utils/Slider';
  import { DrawFn, setCanvasContext } from './CanvasContext';
  import RelativeGrid from './RelativeGrid.svelte';

  export let sliders = new Sliders();
  export let zoom = 1;
  export let maxZoom = 3;
  export let minZoom = 1 / 2;

  class FnToDraw {
    constructor(public key: symbol, public fn: DrawFn) {
      this.key = key;
      this.fn = fn;
    }

    equals(other: FnToDraw) {
      return this.key === other.key;
    }
  }

  let clientHeight: number;
  let clientWidth: number;
  let isFullscreen = false;
  let sceneEl: HTMLDivElement;

  // Slider panel
  let sliderSelected: number = null;
  let isChangeing = false; // Are any of the sliders being changed?

  // Array with steps to draw scene
  let fnsToDraw: FnToDraw[] = [];
  let [mouseX, mouseY] = [0, 0];

  // Isolate draw function to prevent it from applying transformations and styles to other draw functions
  function isolate(draw: DrawFn): DrawFn {
    return (p5: p5) => {
      p5.push();
      draw(p5);
      p5.pop();
    };
  }

  function setRelative(draw: DrawFn): DrawFn {
    return (p5: p5) => {
      p5.push();

      p5.scale(1, -1);
      p5.translate(p5.width / 2, -p5.height / 2);

      draw(p5);

      p5.pop();
    };
  }

  function reset() {
    sliders = sliders.reset();

    zoom = 1;
  }

  const params = {
    mouseX: writable(mouseX),
    mouseY: writable(mouseY),
    width: writable(clientWidth),
    height: writable(clientHeight),
    scale: writable(zoom)
  };

  $: {
    params.scale.set(zoom);
    params.height.set(clientHeight);
    params.width.set(clientWidth);
  }

  // Set context for all children of this component: https://svelte.dev/tutorial/context-api
  setCanvasContext({
    addDrawFn: (fn: DrawFn, key: symbol, isRelative: boolean) => {
      fn = isolate(fn);

      if (isRelative) {
        fn = setRelative(fn);
      }

      fnsToDraw.push(new FnToDraw(key, fn));
    },
    removeDrawFn: (key: symbol) => {
      let index = fnsToDraw.findIndex((draw) => draw.key === key);

      if (index > -1) {
        fnsToDraw.splice(index, 1);
      }
    },
    mouseX: params.mouseX,
    mouseY: params.mouseY,
    width: params.width,
    height: params.height,
    scale: params.scale
  });

  const sketch = (p5: p5) => {
    p5.setup = () => {
      p5.createCanvas(clientWidth, clientHeight);
    };

    p5.draw = () => {
      p5.resizeCanvas(clientWidth, clientHeight); // todo: try to optimise this

      p5.translate(p5.width / 2, p5.height / 2);

      p5.scale(zoom);
      p5.translate(-p5.width / 2, -p5.height / 2);

      fnsToDraw.forEach((draw) => draw.fn(p5)); // Draw each step of the scene
    };

    p5.mouseDragged = () => {
      mouseX = p5.mouseX;
      mouseY = p5.mouseY;

      params.mouseX.set(mouseX);
      params.mouseY.set(mouseY);
    };

    p5.mouseWheel = (event: WheelEvent) => {
      if (zoom < minZoom && event.deltaY < 0) return;
      if (zoom > maxZoom && event.deltaY > 0) return;

      zoom += event.deltaY / 1000;
    };
  };

  onDestroy(() => {
    fnsToDraw = [];
  });
</script>

<div bind:this={sceneEl} class="sketch" bind:clientHeight bind:clientWidth>
  <P5 {sketch}>
    <RelativeGrid let:mouseX let:mouseY>
      <slot mouseX={mouseX / 100} mouseY={mouseY / 100} />
    </RelativeGrid>
  </P5>

  <!-- SLIDER PANEL -->
  <div style="max-width: calc(100vw - 6rem); touch-action:none;">
    <UI visible={!!sliders.sliders.length} bottom opacity>
      {#if sliderSelected == null}<p class="text-black">click us</p>{/if}
      {#each sliders.sliders as slider, index}
        <SvelteSlider
          bind:slider
          isSelected={sliderSelected == index}
          on:mousedown={() => (isChangeing = true)}
          on:mouseup={() => (isChangeing = false)}
          on:indexSelected={() => (sliderSelected = index)}
          on:closeSelected={() => (sliderSelected = null)}
        />
      {/each}
    </UI>
  </div>

  <!-- UI -->
  <UI column bottom right opacity styled={false}>
    <RoundButton icon={mdiRestart} on:click={reset} />

    <ToggleFullscreen {sceneEl} bind:isFullscreen />
  </UI>
</div>

<style>
  .sketch {
    height: 100%;
    max-width: 100vw;
    overflow: hidden;
    user-select: none;
    touch-action: none;
    background: white;
  }
</style>
