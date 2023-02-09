<script lang="ts">
  import { Axis2D, Canvas2D, Line2D, Vector2D } from 'p5-components';

  import { GridType } from 'p5-components/components/Grids';
  import { Vector2 } from 'three';
  import { PrimeColor } from 'utils/PrimeColors';

  let zoom = 1;

  const v0 = new Vector2(5, 0);
  const v1 = new Vector2(3, 1);
  const u = v1.clone().sub(v0);
</script>

<div style="height:100%;">
  <div style="position: fixed; z-index: 1000">
    {zoom.toFixed(2)}
  </div>

  <Canvas2D bind:zoom let:mouseX let:mouseY>
    <Axis2D gridType={GridType.squareGrid} />

    <Line2D start={[-10, 7.5]} end={[10, -2.5]} color={PrimeColor.ultramarine} width={2} />

    <!-- V0 -->
    <Vector2D direction={v0} length={v0.length()} color={PrimeColor.red} />

    <!-- V1 -->
    <Vector2D direction={v1} length={v1.length()} color={PrimeColor.yellow} />

    <!-- U -->
    <Vector2D direction={u} length={u.length()} color={PrimeColor.green} />
    <Vector2D origin={v0} direction={u} length={u.length()} color={PrimeColor.green} />
  </Canvas2D>
</div>
