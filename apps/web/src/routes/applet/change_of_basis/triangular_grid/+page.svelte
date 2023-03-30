<script lang="ts">
  import { Arc2D, Axis2D, Canvas2D, Latex2D, Vector2D } from 'p5-components';

  import { GridType } from 'p5-components/components/Grids';
  import { Vector2 } from 'three';
  import { PrimeColor } from 'utils/PrimeColors';

  const b1 = new Vector2(Math.sqrt(4 / 3) * 2, 0);
  const b2 = new Vector2(-Math.sqrt(4 / 3), 2);

  const b1tob2 = b1.clone().add(b2);
  const minusB1 = b1.clone().multiplyScalar(-1);
</script>

<Canvas2D>
  <Axis2D gridType={GridType.triangularGrid} />

  <!-- Arcs -->
  <Arc2D points={[b1, b1tob2]} distance={0.75} color={PrimeColor.green} />
  <Arc2D points={[b2, minusB1]} distance={0.75} color={PrimeColor.green} />

  <!-- Bases -->
  <Vector2D direction={b1} length={b1.length()} color={PrimeColor.ultramarine}>
    <Latex2D latex={'\\vec{b_1}'} offset={new Vector2(0.2, 0.2)} />
  </Vector2D>
  <Vector2D direction={b2} length={b2.length()} color={PrimeColor.ultramarine}>
    <Latex2D latex={'\\vec{b_2}'} offset={new Vector2(-0.2, 0.2)} />
  </Vector2D>

  <!-- B1 + B2 -->
  <Vector2D direction={b1tob2} length={b1.length()} color={PrimeColor.red}>
    <Latex2D latex={'\\vec{b_1} + \\vec{b_2}'} offset={new Vector2(0.2, 0.2)} />
  </Vector2D>

  <!-- Minus B1 -->
  <Vector2D direction={minusB1} length={b1.length()} color={PrimeColor.red}>
    <Latex2D latex={'-\\vec{b_1}'} offset={new Vector2(-0.2, 0.2)} />
  </Vector2D>
</Canvas2D>
