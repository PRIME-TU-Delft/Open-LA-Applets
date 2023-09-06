<script lang="ts">
  import type p5 from 'p5';

  import P5 from '$lib/components/P5.svelte';
  import RelativeGrid from './RelativeGrid.svelte';
  import { setDefaultContext, type ContextParams, type FnToDraw } from './CanvasUtils';
  import type { Vector2 } from 'three';
  import { get, writable } from 'svelte/store';

  export let size: { width: number; height: number } = { width: 500, height: 500 };
  export let fnsToDraw: FnToDraw[] = []; // Array with steps to draw scene

  let oldSize = { ...size };

  // Stores all critical parameters for the canvas
  const params: ContextParams = {
    mouseX: writable(0),
    mouseY: writable(0),
    width: writable(size.width),
    height: writable(size.height),
    scale: writable(1)
  };

  // Set context for all children of this component: https://svelte.dev/tutorial/context-api
  setDefaultContext(fnsToDraw, params);

  const sketch = (p5: p5) => {
    p5.setup = () => {
      p5.createCanvas(size.width, size.height);
    };

    p5.draw = () => {
      p5.background(255);

      if (oldSize.width !== size.width || oldSize.height !== size.height) {
        p5.resizeCanvas(size.width, size.height);
        oldSize = { ...size };
      }

      p5.translate(p5.width / 2, p5.height / 2);

      p5.scale(get(params.scale));
      p5.translate(-p5.width / 2, -p5.height / 2);

      fnsToDraw.forEach((draw) => draw.fn(p5)); // Draw each step of the scene
    };

    p5.mousePressed = () => {
      // TODO
    };

    p5.mouseReleased = () => {
      // TODO
    };

    p5.mouseDragged = () => {
      // TODO
    };

    p5.mouseWheel = (event: WheelEvent) => {
      let scale = get(params.scale);
      const maxZoom = 3;
      const minZoom = 1 / 2;

      if (scale < minZoom && event.deltaY > 0) return;
      if (scale > maxZoom && event.deltaY < 0) return;

      scale -= event.deltaY / 1000;
      params.scale.set(scale);
    };
  };
</script>

<P5 {sketch}>
  <RelativeGrid let:mouseX let:mouseY>
    <slot mouseX={mouseX / 100} mouseY={mouseY / 100} />
  </RelativeGrid>
</P5>
