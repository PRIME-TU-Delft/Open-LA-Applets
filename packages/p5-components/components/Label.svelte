<script lang="ts">
  import p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { Vector2 } from 'three';

  import { getCanvasContext, getRelativeContext, getLabelPosition } from './CanvasContext';

  export let text: string = '';
  export let textSize: number = 16;
  export let position: Vector2 = new Vector2(0, 0);
  export let offset: Vector2 = new Vector2(0, 0);
  export let color: string = 'black';

  let canvasContext = getCanvasContext();
  let isRelative = getRelativeContext();
  let labelPosition = getLabelPosition();
  let scale = canvasContext.scale;

  const key = Symbol('label');

  onMount(() => {
    canvasContext.addDrawFn(draw, key, isRelative);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(key);
  });

  function draw(p5: p5) {
    p5.textSize(textSize / $scale);
    p5.fill(color);

    p5.translate(
      (offset.x + ($labelPosition.x || position.x)) * 100,
      (offset.y + ($labelPosition.y || position.y)) * 100
    );
    p5.scale(1, -1);

    p5.text(text, 0, 0);
  }
</script>
