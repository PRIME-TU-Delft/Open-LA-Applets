<script lang="ts">
  import type p5 from 'p5';

  import P5 from '$lib/components/P5.svelte';
  import RelativeGrid from './RelativeGrid.svelte';
  import {
    setDefaultContext,
    type ContextParams,
    type FnToDraw,
    type Draggable,
    draggables
  } from './CanvasUtils';
  import { get, writable } from 'svelte/store';
  import { Vector2 } from 'three';
  import { onDestroy } from 'svelte';

  export let size: { width: number; height: number } = { width: 500, height: 500 };
  export let fnsToDraw: FnToDraw[] = []; // Array with steps to draw scene

  let oldSize = { ...size };
  let selectedDraggable: Draggable | undefined;

  // Stores all critical parameters for the canvas
  const params: ContextParams = {
    mouseX: writable(0),
    mouseY: writable(0),
    width: writable(size.width),
    height: writable(size.height),
    scale: writable(1),
    draggables
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
      const scale = get(params.scale);

      // Find nearest draggable object
      let x = (p5.mouseX - p5.width / 2) / (100 * scale);
      let y = (p5.height / 2 - p5.mouseY) / (100 * scale);
      let mouse = new Vector2(x, y);

      const $draggables = get(params.draggables);

      if ($draggables.length === 0) return;

      let nearestDraggables = [...$draggables].sort((a, b) => {
        let aDist = get(a.position).distanceTo(mouse);
        let bDist = get(b.position).distanceTo(mouse);
        return aDist - bDist;
      });

      const closestPosition = get(nearestDraggables[0].position);
      selectedDraggable =
        closestPosition.distanceTo(mouse) < 0.5 ? nearestDraggables[0] : undefined;
    };

    p5.mouseReleased = () => {
      selectedDraggable = undefined;
    };

    p5.mouseDragged = () => {
      params.mouseX.set(p5.mouseX);
      params.mouseY.set(p5.mouseY);

      const scale = get(params.scale);

      const $draggables = get(params.draggables);

      if ($draggables.length > 0 && selectedDraggable) {
        let x = (p5.mouseX - p5.width / 2) / (100 * scale);
        let y = (p5.height / 2 - p5.mouseY) / (100 * scale);
        selectedDraggable.position.update((p) => {
          p.x = x;
          p.y = y;

          return p;
        });
      }
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

  onDestroy(() => {
    draggables.reset();
  });
</script>

<P5 {sketch}>
  <RelativeGrid let:mouseX let:mouseY>
    <slot mouseX={mouseX / 100} mouseY={mouseY / 100} />
  </RelativeGrid>
</P5>
