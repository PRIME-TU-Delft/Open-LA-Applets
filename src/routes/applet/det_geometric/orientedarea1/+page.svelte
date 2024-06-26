<script lang="ts">
  import { Arc2D, Canvas2D, Latex2D, Vector2D } from '$lib/d3-components';
  import Draggable from '$lib/d3-components/Draggable.svelte';
  import Parallelogram from '$lib/d3-components/Parallelogram.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Vector3 } from 'three';
  import RightScene from './RightScene.svelte';

  let u = new Vector2(3, 1);
  let v = new Vector2(0.5, 2);

  $: C = u.clone().add(v);
</script>

<Canvas2D
  splitCanvas3DProps={{ cameraZoom: 50, cameraPosition: new Vector3(5.79, 14.65, 7.2) }}
  showAxisNumbers={false}
>
  <Parallelogram points={[new Vector2(0, 0), u, v]} color={PrimeColor.yellow} />

  <!-- U & V -->
  <Draggable bind:position={u} color={PrimeColor.raspberry} id="u" />
  <Draggable bind:position={v} color={PrimeColor.darkGreen} id="v" />
  <Vector2D direction={u} length={u.length()} color={PrimeColor.raspberry} let:endPoint>
    <Latex2D
      latex={'\\mathbf{u}'}
      offset={new Vector2(0.2, -0.1)}
      position={endPoint.clone().multiplyScalar(0.5)}
      color={PrimeColor.raspberry}
    />
    <Latex2D latex={'A'} extend={0.2} position={endPoint} />
  </Vector2D>

  <Vector2D direction={v} length={v.length()} color={PrimeColor.darkGreen} let:endPoint>
    <Latex2D
      latex={'\\mathbf{v}'}
      offset={new Vector2(0.1, -0.1)}
      position={endPoint.clone().multiplyScalar(0.5)}
      color={PrimeColor.darkGreen}
    />
    <Latex2D latex={'B'} extend={0.4} offset={new Vector2(-0.2, 0)} position={endPoint} />
  </Vector2D>

  <!-- e1 -->
  <Vector2D direction={new Vector2(1, 0)} length={1} color={PrimeColor.blue} let:endPoint>
    <Latex2D latex={'\\mathbf{e_1}'} offset={new Vector2(-0.5, -0.15)} position={endPoint} />
  </Vector2D>

  <!-- e2 -->
  <Vector2D direction={new Vector2(0, 1)} length={1} color={PrimeColor.blue} let:endPoint>
    <Latex2D latex={'\\mathbf{e_2}'} offset={new Vector2(-0.4, -0.3)} position={endPoint} />
  </Vector2D>

  <Latex2D latex={`C`} offset={new Vector2(0.1, 0.2)} position={C} />

  <Arc2D points={[u, v]} />

  <svelte:fragment slot="splitCanvas3d">
    <!-- To reduce clutter in this file, the right scene is defined in a separate file. -->
    <RightScene {u} {v} />
  </svelte:fragment>
</Canvas2D>
