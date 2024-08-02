<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const draggables = [
    new Draggable(new Vector2(1, 3), PrimeColor.darkGreen, 'w'),
    new Draggable(new Vector2(3, 0), PrimeColor.blue, 'v')
  ];

  let w = $derived(draggables[0].value);
  let v = $derived(draggables[1].value);

  const vPlusW = $derived(w.clone().add(v));

  const formulas = $derived.by(() => {
    const f1 = new Formula('|| \\mathbf{v} || = \\$', Math.abs(v.length()), PrimeColor.blue);
    const f2 = new Formula('|| \\mathbf{w} || = \\$', Math.abs(w.length()), PrimeColor.darkGreen);
    const f3 = new Formula(
      '|| \\mathbf{v} + \\mathbf{w} || = \\$',
      Math.abs(vPlusW.length()),
      PrimeColor.raspberry
    );

    return [f1, f2, f3];
  });
</script>

<Canvas2D {draggables} {formulas}>
  <!-- Bases -->
  <Vector2D direction={v} length={v.length()} color={PrimeColor.blue}>
    {#snippet children(endPoint)}
      <Latex2D
        position={endPoint}
        latex={'\\mathbf{v}'}
        offset={new Vector2(-0.2, 0.2)}
        color={PrimeColor.blue}
      />
    {/snippet}
  </Vector2D>
  <Vector2D direction={w} length={w.length()} color={PrimeColor.darkGreen}>
    {#snippet children(endPoint)}
      <Latex2D
        position={endPoint}
        latex={'\\mathbf{w}'}
        offset={new Vector2(-0.2, 0.2)}
        color={PrimeColor.darkGreen}
      />
    {/snippet}
  </Vector2D>

  <!-- v+w -->
  <Vector2D direction={vPlusW} length={vPlusW.length()} color={PrimeColor.raspberry}>
    {#snippet children(endPoint)}
      <Latex2D
        position={endPoint}
        latex={'\\mathbf{v} + \\mathbf{w}'}
        offset={new Vector2(0.2, 0.2)}
        color={PrimeColor.raspberry}
      />
    {/snippet}
  </Vector2D>

  <!-- Helper lins -->
  <Vector2D
    origin={v}
    direction={w}
    length={w.length()}
    color={PrimeColor.darkGreen}
    isDashed
    hideHead
  />
</Canvas2D>
