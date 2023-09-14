<script lang="ts">
  import type p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { getCanvasContext, getRelativeContext } from './CanvasContext';

  export let radius = 1;
  export let color: PrimeColor = PrimeColor.black;
  export let startAngle = 0;
  export let endAngle = Math.PI * 2;
  export let origin = new Vector2(0, 0);
  export let width = 2;
  export let isDashed = false;

  let canvasContext = getCanvasContext();
  let isRelative = getRelativeContext();
  let scale = canvasContext.scale;

  const DISTANCE_MULT = 200;

  const key = Symbol('circle');

  onMount(() => {
    canvasContext.addDrawFn(draw, key, isRelative);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(key);
  });

  function draw(p5: p5) {
    p5.stroke(color);
    p5.strokeWeight(width / $scale);

    if (isDashed) {
      p5.drawingContext.setLineDash([5, 5]);
    }

    p5.noFill();
    p5.arc(
      origin.x,
      origin.y,
      radius * DISTANCE_MULT,
      radius * DISTANCE_MULT,
      startAngle,
      endAngle
    );
  }
</script>
