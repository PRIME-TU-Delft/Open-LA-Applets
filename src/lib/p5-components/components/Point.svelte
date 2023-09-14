<script lang="ts">
  import type p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { Vector2 } from 'three';

  import { getCanvasContext, getRelativeContext, setLabelPosition } from './CanvasContext';

  export let position: Vector2;
  export let isSquare = false;
  export let radius: number = 5;
  export let color: string = 'black';
  export let pulse = false;
  export let opacity = 1;

  const canvasContext = getCanvasContext();
  const isRelative = getRelativeContext();
  let scale = canvasContext.scale;

  let labelPosition = writable(position);
  setLabelPosition(labelPosition);
  $: labelPosition.set(position);

  const key = Symbol('point');

  onMount(() => {
    canvasContext.addDrawFn(draw, key, isRelative);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(key);
  });

  function draw(p5: p5) {
    const pointColor = p5.color(color);
    pointColor.setAlpha(Math.round(255 * opacity));
    p5.stroke(pointColor);

    p5.fill(pointColor);
    p5.strokeWeight(radius / $scale);

    if (pulse) {
      p5.strokeWeight((radius * 1.5 + 0.5 * radius * Math.sin(p5.millis() / 500)) / $scale);
    }

    if (isSquare) {
      p5.square(position.x * 100, position.y * 100, 1);
    } else {
      p5.point(position.x * 100, position.y * 100);
    }
  }
</script>
