<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import SmallestArc2D from '$lib/d3/SmallestArc2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  // #545 regression demo: arc should still meet both vectors under a non-uniform
  // scale, and (being >180° apart in raw angle) also exercises the SmallestArc2D
  // wrap-around fix.
  const draggables = [
    new Draggable(new Vector2(-3, -4), PrimeColor.blue, 'v', Draggable.snapToGrid),
    new Draggable(new Vector2(3, 1), PrimeColor.darkGreen, 'w', Draggable.snapToGrid)
  ];

  const v = $derived(draggables[0].position);
  const w = $derived(draggables[1].position);
</script>

<Canvas2D scaleX={1 / 1.5} scaleY={1 / 3} {draggables}>
  <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} />
  <Latex2D
    latex={'\\mathbf{v}'}
    position={v.clone()}
    offset={new Vector2(0, -0.05)}
    color={PrimeColor.blue}
  />

  <Vector2D direction={w} length={w.length()} color={PrimeColor.darkGreen} />
  <Latex2D
    latex={'\\mathbf{w}'}
    position={w.clone()}
    offset={new Vector2(0, -0.05)}
    color={PrimeColor.darkGreen}
  />

  <SmallestArc2D points={[w, v]} distance={1.5}>
    {#snippet label(position: Vector2)}
      <Latex2D
        latex="\varphi"
        {position}
        offset={new Vector2(0, 0.1)}
        extend={0.1}
        color={PrimeColor.black}
      />
    {/snippet}
  </SmallestArc2D>
</Canvas2D>
