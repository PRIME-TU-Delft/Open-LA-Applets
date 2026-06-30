<script>
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Vector2 } from 'three';

  const draggables = [
    new Draggable(new Vector2(1, 2), undefined, undefined, (v) => {
      const t = (v.x + v.y) / 2;
      return new Vector2(t, t);
    })
  ];
</script>

<Canvas2D scaleX={1 / 1.5} scaleY={1 / 3} {draggables}>
  <Vector2D direction={draggables[0].position} length={draggables[0].position.length() - 0.8} />

  <Point2D position={new Vector2(4, 4)} />
</Canvas2D>
