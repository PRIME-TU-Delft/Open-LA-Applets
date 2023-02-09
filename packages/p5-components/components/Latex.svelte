<script lang="ts">
  import { Vector2 } from 'three';
  import { LatexUI } from 'ui';

  import { getCanvasContext, getLabelPosition } from './CanvasContext';

  export let latex: string = '';
  export let textSize: number = 16;
  export let position: Vector2 = new Vector2(0, 0);
  export let offset: Vector2 = new Vector2(0, 0);
  export let color: string = 'black';

  let labelPosition = getLabelPosition();
  let canvasContext = getCanvasContext();
  const { scale } = canvasContext;
</script>

<div
  class="latex"
  style="--position-x: {(offset.x + ($labelPosition?.x || position.x)) *
    100 *
    $scale}px; --position-y: {-1 *
    (offset.y + ($labelPosition?.y || position.y)) *
    100 *
    $scale}px; color: {color}; font-size: {textSize}px;"
>
  <LatexUI {latex} />
</div>

<style>
  .latex {
    position: absolute;
    top: 50%;
    left: 50%;
    color: var(--color, black);
    font-size: var(--text-size, 1rem);
    transform: translate(calc(var(--position-x, 0px) - 50%), calc(var(--position-y, 0px) - 50%));
  }
</style>
