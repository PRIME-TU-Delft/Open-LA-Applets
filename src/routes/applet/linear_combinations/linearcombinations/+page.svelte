<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const v1 = new Vector2(1.5, 0.5);
  const v2 = new Vector2(0.5, 2);

  const draggables = [new Draggable(new Vector2(4, 5), PrimeColor.blue, 'u', Draggable.snapToGrid)];
  const u = $derived(draggables[0].position);

  const beta = $derived((u.x + u.y * (-v1.x / v1.y)) / (v2.x - v2.y * (v1.x / v1.y)));
  const alpha = $derived((u.x - v2.x * beta) / v1.x);

  const v1Extended = $derived(v1.length() * alpha);
  const v2Extended = $derived(v2.length() * beta);
</script>

<Canvas2D {draggables} cameraZoom={0.7}>
  <!-- Bases -->
  <Vector2D direction={v1} length={v1.length()} color={PrimeColor.darkGreen}>
    {#snippet children(endPoint)}
      <Latex2D
        position={endPoint}
        latex={'\\mathbf{v}_1'}
        offset={new Vector2(0.2, -0.1)}
        color={PrimeColor.darkGreen}
      />
    {/snippet}
  </Vector2D>
  <Vector2D direction={v2} length={v2.length()} color={PrimeColor.raspberry}>
    {#snippet children(endPoint)}
      <Latex2D
        position={endPoint}
        latex={'\\mathbf{v}_2'}
        offset={new Vector2(0.2, 0.2)}
        color={PrimeColor.raspberry}
      />
    {/snippet}
  </Vector2D>

  <!-- u -->
  <Vector2D direction={u} length={u.length()} color={PrimeColor.blue}>
    {#snippet children(endPoint)}
      <Latex2D
        position={endPoint}
        latex={'\\mathbf{u}'}
        offset={new Vector2(0.1, 0.2)}
        color={PrimeColor.blue}
      />
    {/snippet}
  </Vector2D>

  <!-- Bases extended -->
  <Vector2D
    direction={v1.clone().multiplyScalar(alpha)}
    length={Math.abs(v1Extended)}
    color={PrimeColor.darkGreen}
    isDashed
  >
    {#snippet children(endPoint)}
      <Latex2D
        position={endPoint.clone().add(endPoint.clone().normalize().multiplyScalar(0.3))}
        latex={`${alpha.toFixed(2)} \\mathbf{v}_1`}
      />

      <Vector2D
        origin={endPoint}
        direction={v2}
        length={v2Extended}
        color={PrimeColor.black}
        isDashed
        hideHead
      />
    {/snippet}
  </Vector2D>

  <Vector2D
    direction={v2.clone().multiplyScalar(beta)}
    length={Math.abs(v2Extended)}
    color={PrimeColor.raspberry}
    isDashed
  >
    {#snippet children(endPoint)}
      <Latex2D
        position={endPoint}
        offset={endPoint.clone().normalize().multiplyScalar(0.45).sub(new Vector2(0.4, 0))}
        latex={`${beta.toFixed(2)} \\mathbf{v}_2`}
      />
      <Vector2D
        origin={endPoint}
        direction={v1}
        length={v1Extended}
        color={PrimeColor.black}
        isDashed
        hideHead
      />
    {/snippet}
  </Vector2D>
</Canvas2D>
