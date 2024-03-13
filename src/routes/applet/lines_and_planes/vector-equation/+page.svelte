<script lang="ts">
  import {
    Canvas2D,
    Draggable2D,
    InfiniteLine2D,
    Latex2D,
    Line2D,
    Vector2D
  } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const v0 = new Vector2(5, 0);
  let u = new Vector2(-2, 1);

  $: v1 = v0.clone().add(u);
  $: dir_L = v1.clone().sub(v0.clone());
</script>

<Canvas2D>
  <!-- Line L -->
  <InfiniteLine2D origin={v0} direction={dir_L} color={PrimeColor.cyan} />

  <!-- V0 -->
  <Vector2D direction={v0} length={v0.length()} color={PrimeColor.red} let:endPoint>
    <Latex2D
      latex={'\\mathbf{v}_0'}
      position={endPoint}
      offset={new Vector2(0.1, 0.2)}
      color={PrimeColor.red}
    />
    <Latex2D
      latex={'\\mathcal{L}_1'}
      offset={u.clone().multiplyScalar(-0.2).add(new Vector2(-0.2, -0.2))}
      position={endPoint}
      color={PrimeColor.blue}
    />
  </Vector2D>

  <!-- V1 -->
  <Vector2D direction={v1} length={v1.length()} color={PrimeColor.yellow} let:endPoint>
    <Latex2D
      latex={'\\mathbf{v}_1'}
      position={endPoint}
      offset={new Vector2(-0.3, -0.3)}
      color={PrimeColor.yellow}
    />
  </Vector2D>

  <!-- U -->
  <Draggable2D snap id="u" bind:position={u} color={PrimeColor.darkGreen} />
  <Vector2D direction={u} length={u.length()} color={PrimeColor.darkGreen} let:endPoint>
    <Latex2D
      latex={'\\mathbf{u}'}
      position={endPoint}
      offset={new Vector2(0.1, 0.2)}
      color={PrimeColor.darkGreen}
    />
  </Vector2D>

  <Vector2D origin={v0} direction={u} length={u.length()} color={PrimeColor.darkGreen} let:endPoint>
    <Latex2D
      latex={'\\mathbf{u}'}
      position={endPoint}
      offset={new Vector2(0.1, 0.2)}
      color={PrimeColor.darkGreen}
    />
  </Vector2D>
</Canvas2D>
