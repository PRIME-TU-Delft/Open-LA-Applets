<script lang="ts">
  import p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { Vector2 } from 'three';
  import { PrimeColor } from 'utils/PrimeColors';
  import { getCanvasContext, getRelativeContext } from './CanvasContext';

  export let color: PrimeColor = PrimeColor.black;
  export let points: [Vector2, Vector2];
  export let origin = new Vector2(0, 0);
  export let width = 2;
  export let distance = 0.5;

  let canvasContext = getCanvasContext();
  let isRelative = getRelativeContext();
  let scale = canvasContext.scale;

  const DISTANCE_MULT = 200;

  const key = Symbol('arc');

  onMount(() => {
    canvasContext.addDrawFn(draw, key, isRelative);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(key);
  });

  function draw(p5: p5) {
    p5.stroke(color);
    p5.strokeWeight(width / $scale);
    p5.noFill();
    p5.arc(
      origin.x,
      origin.y,
      distance * DISTANCE_MULT,
      distance * DISTANCE_MULT,
      points[0].clone().angle(),
      points[1].clone().angle()
    );
  }
</script>
