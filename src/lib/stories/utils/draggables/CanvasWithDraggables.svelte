<script lang="ts">
  import { Canvas2D, Latex2D, Vector2D, Draggable2D } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  export let title: string = 'default title';
  export let snap: boolean = false;

  let w = new Vector2(1, 3);
  let v = new Vector2(3, 0);
</script>

<Canvas2D {title}>
  <Draggable2D id="w" {snap} bind:position={w} color={PrimeColor.darkGreen} />
  <Draggable2D id="v" {snap} bind:position={v} color={PrimeColor.blue} />

  <Vector2D direction={w} length={w.length()} color={PrimeColor.darkGreen} />
  <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} />
</Canvas2D>
