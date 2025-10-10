<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let direction1 = new Vector2(1, 2);
  let direction2 = new Vector2(2, 0);

  // The addition of two vectors is their sum
  // We need to clone the vectors to avoid mutating the original ones
  let v_result = direction1.clone().add(direction2.clone());
</script>

<!-- We give the Canvas2D component a title prop -->
<Canvas2D title="applets.tutorials.complex_numbers_addition">
  <Vector2D direction={direction1} length={direction1.length()} color={PrimeColor.blue} />
  <Vector2D direction={direction2} length={direction2.length()} color={PrimeColor.darkGreen} />

  <!-- Sum vector (the addition of direction1 and direction2) -->
  <Vector2D direction={v_result} length={v_result.length()} color={PrimeColor.raspberry} />
  <Latex2D latex="z_3" position={v_result} color={PrimeColor.raspberry} />

  <!-- Helper vectors that point from the original vectors to the result vector -->
  <Vector2D
    direction={direction1}
    length={direction1.length()}
    origin={direction2}
    isDashed={true}
    hideHead={true}
    color={PrimeColor.blue}
  />
  <Vector2D
    direction={direction2}
    length={direction2.length()}
    origin={direction1}
    isDashed={true}
    hideHead={true}
    color={PrimeColor.darkGreen}
  />
</Canvas2D>
