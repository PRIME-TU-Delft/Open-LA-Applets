<script lang="ts">
  import type p5 from 'p5';
  import { P5 } from 'p5-svelte';
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { RoundButton, ToggleFullscreen, UI } from 'ui';
  import { DrawFn, setCanvasContext } from './CanvasContext';
  import RelativeGrid from './RelativeGrid.svelte';
  import { mdiRestart } from '@mdi/js';

  export let zoom = 1;
  export let maxZoom = 3;
  export let minZoom = 1 / 2;

  let clientHeight: number;
  let clientWidth: number;
  let isFullscreen = false;
  let sceneEl: HTMLDivElement;

  // Array with steps to draw scene
  let fnsToDraw: DrawFn[] = [];
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
    addDrawFn: (fn: DrawFn, isRelative: boolean) => {
      fn = isolate(fn);

      if (isRelative) {
        fn = setRelative(fn);
      }

      fnsToDraw.push(fn);
    },
    removeDrawFn: (fn: DrawFn, isRelative: boolean) => {
      fn = isolate(fn);

      if (isRelative) {
        fn = setRelative(fn);
      }

      let index = fnsToDraw.indexOf(fn);
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

      fnsToDraw.forEach((draw) => draw(p5)); // Draw each step of the scene
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

  <UI column bottom right opacity styled={false}>
    <RoundButton icon={mdiRestart} on:click={reset} />

    <ToggleFullscreen {sceneEl} bind:isFullscreen />
  </UI>
</div>

<style>
  .sketch {
    height: 100%;
    user-select: none;
    touch-action: none;
    background: white;
  }
</style>
