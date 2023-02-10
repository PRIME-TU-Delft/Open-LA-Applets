<script lang="ts">
  import p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { Vector2 } from 'three';

  import { getCanvasContext, getRelativeContext, setLabelPosition } from './CanvasContext';

  export let position: Vector2;
  export let isSquare = false;
  export let radius: number = 5;
  export let color: string = 'black';
  export let pulse = false;

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
    p5.stroke(color);
    p5.fill(color);
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
