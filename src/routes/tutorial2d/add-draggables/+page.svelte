<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  // Wrap with draggable with label 'z_1'
  let direction1 = new Draggable(new Vector2(1, 2), PrimeColor.blue, 'z_1', Draggable.snapToGrid);
  let direction2 = new Vector2(2, 0);

  // The addition of two vectors is their sum
  // We need to clone the vectors to avoid mutating the original ones
  let v_result = $derived(direction1.position.clone().add(direction2.clone()));
</script>

<Canvas2D
  draggables={[direction1]}
  title="applets.tutorials.complex_numbers_addition"
>
  <Vector2D
    direction={direction1.position}
    length={direction1.position.length()}
    color={PrimeColor.blue}
  />
  <Vector2D direction={direction2} length={direction2.length()} color={PrimeColor.darkGreen} />
  <Latex2D
    latex="z_2"
    position={direction2}
    offset={new Vector2(0.15, 0)}
    color={PrimeColor.darkGreen}
  />

  <Vector2D direction={v_result} length={v_result.length()} color={PrimeColor.raspberry} />
  <Latex2D latex="z_3" position={v_result} color={PrimeColor.raspberry} />

  <Vector2D
    direction={direction1.position}
    length={direction1.position.length()}
    origin={direction2}
    isDashed={true}
    hideHead={true}
    color={PrimeColor.blue}
  />
  <Vector2D
    direction={direction2}
    length={direction2.length()}
    origin={direction1.position}
    isDashed={true}
    hideHead={true}
    color={PrimeColor.darkGreen}
  />
</Canvas2D>
