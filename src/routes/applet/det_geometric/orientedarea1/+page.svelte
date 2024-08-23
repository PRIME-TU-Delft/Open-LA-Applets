<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Arc2D from '$lib/d3/Arc2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Parallelogram2D from '$lib/d3/Parallelogram2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Vector3 } from 'three';
  import RightScene from './RightScene.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';

  const draggables = [
    new Draggable(new Vector2(3, 1), PrimeColor.raspberry, 'u'),
    new Draggable(new Vector2(0.5, 2), PrimeColor.darkGreen, 'v')
  ];

  const u = $derived(draggables[0].value);
  const v = $derived(draggables[1].value);

  const C = $derived(u.clone().add(v));
</script>

<Canvas2D
  {draggables}
  splitCanvas3DProps={{ cameraZoom: 50, cameraPosition: new Vector3(5.79, 14.65, 7.2) }}
  showAxisNumbers={false}
>
  <Parallelogram2D points={[new Vector2(0, 0), u, v]} color={PrimeColor.yellow} />

  <!-- U & V -->
  <Vector2D direction={u} length={u.length()} color={PrimeColor.raspberry}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{u}'}
        offset={new Vector2(0.2, -0.1)}
        position={endPoint.clone().multiplyScalar(0.5)}
        color={PrimeColor.raspberry}
      />
      <Latex2D latex={'A'} extend={0.2} position={endPoint} />
    {/snippet}
  </Vector2D>

  <Vector2D direction={v} length={v.length()} color={PrimeColor.darkGreen}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{v}'}
        offset={new Vector2(0.1, -0.1)}
        position={endPoint.clone().multiplyScalar(0.5)}
        color={PrimeColor.darkGreen}
      />
      <Latex2D latex={'B'} extend={0.4} offset={new Vector2(-0.2, 0)} position={endPoint} />
    {/snippet}
  </Vector2D>

  <!-- e1 -->
  <Vector2D direction={new Vector2(1, 0)} length={1} color={PrimeColor.blue}>
    {#snippet children(endPoint)}
      <Latex2D latex={'\\mathbf{e_1}'} offset={new Vector2(-0.5, -0.15)} position={endPoint} />
    {/snippet}
  </Vector2D>

  <!-- e2 -->
  <Vector2D direction={new Vector2(0, 1)} length={1} color={PrimeColor.blue}>
    {#snippet children(endPoint)}
      <Latex2D latex={'\\mathbf{e_2}'} offset={new Vector2(-0.4, -0.3)} position={endPoint} />
    {/snippet}
  </Vector2D>

  <Latex2D latex={`C`} offset={new Vector2(0.1, 0.2)} position={C} />

  <Arc2D points={[u, v]} />

  {#snippet splitCanvas3DChildren()}
    <!-- To reduce clutter in this file, the right scene is defined in a separate file. -->
    <RightScene {u} {v} />
  {/snippet}
</Canvas2D>
