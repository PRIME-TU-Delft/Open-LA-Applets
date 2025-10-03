<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import NumberFlow from '@number-flow/svelte';
  import { Vector2 } from 'three';

  const controls = Controls.addSlider(2, 1, 6, 0.25, PrimeColor.darkGreen, {
    label: 'z_2',
    labelFormat
  });

  // Wrap with draggable with label 'z_1'
  let direction1 = new Draggable(new Vector2(1, 2), PrimeColor.blue, 'z_1', Draggable.snapToGrid);
  let direction2 = $derived(new Vector2(2, 0).normalize().multiplyScalar(controls[0]));

  // The addition of two vectors is their sum
  // We need to clone the vectors to avoid mutating the original ones
  let v_result = $derived(direction1.position.clone().add(direction2.clone()));
</script>

{#snippet labelFormat(value: number)}
  <NumberFlow {value} />
{/snippet}

<Canvas2D {controls} draggables={[direction1]} title="Complex numbers addition">
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
