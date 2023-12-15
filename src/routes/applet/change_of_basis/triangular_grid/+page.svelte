<script lang="ts">
  import { Arc2D, Canvas2D, Latex2D, Vector2D, Draggable2D } from '$lib/d3-components';
  import { GridType } from '$lib/d3-components/grids/GridTypes';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let b1 = new Vector2(Math.sqrt(4 / 3) * 2, 0);
  const b2 = new Vector2(-Math.sqrt(4 / 3), 2);

  $: b1plusb2 = b1.clone().add(b2);
  $: minusB1 = b1.clone().multiplyScalar(-1);
</script>

<Canvas2D gridType={GridType.Triangle}>
  <Draggable2D snap id="b1" bind:position={b1} color={PrimeColor.blue} />

  <!-- Arcs -->
  <Arc2D points={[b1, b1plusb2]} distance={0.75} color={PrimeColor.dark_green} />
  <Arc2D points={[b2, minusB1]} distance={0.75} color={PrimeColor.dark_green} />

  <!-- Bases -->
  <Vector2D direction={b1} length={b1.length()} color={PrimeColor.blue} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{b}_1'}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.blue}
    />
  </Vector2D>
  <Vector2D direction={b2} length={b2.length()} color={PrimeColor.blue} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{b}_2'}
      offset={new Vector2(-0.5, 0.2)}
      color={PrimeColor.blue}
    />
  </Vector2D>

  <!-- B1 + B2 -->
  <Vector2D direction={b1plusb2} length={b1plusb2.length()} color={PrimeColor.red} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{b}_1 + \\mathbf{b}_2'}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.red}
    />
  </Vector2D>

  <!-- Minus B1 -->
  <Vector2D direction={minusB1} length={b1.length()} color={PrimeColor.red} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'-\\mathbf{b}_1'}
      offset={new Vector2(-0.6, 0.2)}
      color={PrimeColor.red}
    />
  </Vector2D>
</Canvas2D>
