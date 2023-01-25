<script lang="ts">
  import { setContext } from 'svelte';
  import type p5 from 'p5';

  import { P5 } from 'p5-svelte';

  let clientHeight;
  let clientWidth;

  type DrawFn = (p5: p5) => void;

  // Array with steps to draw scene
  let fnsToDraw: DrawFn[] = [];

  // Set context for all children of this component: https://svelte.dev/tutorial/context-api
  setContext('canvas', {
    addDrawFn: (fn: DrawFn) => {
      fnsToDraw.push(fn);
    },
    removeDrawFn: (fn: DrawFn) => {
      let index = fnsToDraw.indexOf(fn);
      if (index > -1) {
        fnsToDraw.splice(index, 1);
      }
    }
  });

  const sketch = (p5: p5) => {
    p5.setup = () => {
      p5.createCanvas(clientWidth, clientHeight);
    };

    p5.draw = () => {
      p5.resizeCanvas(clientWidth, clientHeight); // todo: try to optimise this

      fnsToDraw.forEach((draw) => draw(p5)); // Draw each step of the scene
    };
  };
</script>

<div class="sketch" bind:clientHeight bind:clientWidth>
  <P5 {sketch}>
    <slot />
  </P5>
</div>

<style>
  .sketch {
    height: 100%;
    user-select: none;
    touch-action: none;
  }
</style>
