<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const draggables = [
    new Draggable(new Vector2(-2, 1), PrimeColor.darkGreen, 'u', Draggable.snapToGrid)
  ];

  const v0 = new Vector2(5, 0);
  const u = $derived(draggables[0].value);

  const v1 = $derived(v0.clone().add(u));
  const dir_L = $derived(v1.clone().sub(v0.clone()));
</script>

<Canvas2D {draggables} title="A parametric vector of a line">
  <!-- Line L -->
  <InfiniteLine2D origin={v0} direction={dir_L} color={PrimeColor.cyan} />

  <!-- V0 -->
  <Vector2D direction={v0} length={v0.length()} color={PrimeColor.raspberry}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{v}_0'}
        position={endPoint}
        offset={new Vector2(0.1, 0.2)}
        color={PrimeColor.raspberry}
      />
      <Latex2D
        latex={'\\mathcal{L}_1'}
        offset={u.clone().multiplyScalar(-0.2).add(new Vector2(-0.2, -0.2))}
        position={endPoint}
        color={PrimeColor.blue}
      />
    {/snippet}
  </Vector2D>

  <!-- V1 -->
  <Vector2D direction={v1} length={v1.length()} color={PrimeColor.yellow}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{v}_1'}
        position={endPoint}
        offset={new Vector2(-0.3, -0.3)}
        color={PrimeColor.yellow}
      />
    {/snippet}
  </Vector2D>

  <!-- U -->
  <!-- <Draggable2D snap id="u" bind:position={u} color={PrimeColor.darkGreen} /> -->
  <Vector2D direction={u} length={u.length()} color={PrimeColor.darkGreen}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{u}'}
        position={endPoint}
        offset={new Vector2(0.1, 0.2)}
        color={PrimeColor.darkGreen}
      />
    {/snippet}
  </Vector2D>

  <Vector2D origin={v0} direction={u} length={u.length()} color={PrimeColor.darkGreen}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{u}'}
        position={endPoint}
        offset={new Vector2(0.1, 0.2)}
        color={PrimeColor.darkGreen}
      />
    {/snippet}
  </Vector2D>
</Canvas2D>
