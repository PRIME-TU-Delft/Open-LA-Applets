<script lang="ts">
  import { Axis2D, Canvas2D, Line2D, Vector2D } from 'p5-components';

  import { GridType } from 'p5-components/components/Grids';
  import { Vector2 } from 'three';
  import { PrimeColor } from 'utils/PrimeColors';
  import { Slider, Sliders } from 'utils/Slider';

  let zoom = 1;

  const v0 = new Vector2(5, 0);
  const v1 = new Vector2(3, 1);
  let u = v1.clone().sub(v0);

  let sliders = new Sliders()
    .add(new Slider(v0.length(), 1, 6, 0.25, PrimeColor.red))
    .add(new Slider(v1.length(), 1, 4, 0.125, PrimeColor.yellow));

  $: {
    v0.setLength(sliders.x);
    v1.setLength(sliders.y);
    u = v1.clone().sub(v0);
  }
</script>

<div style="height:100%;">
  <div style="position: fixed; z-index: 1000">
    {zoom.toFixed(2)}
    {v1.length().toFixed(2)}
  </div>

  <Canvas2D bind:sliders bind:zoom>
    <Axis2D gridType={GridType.squareGrid} />

    <Line2D start={[-10, 7.5]} end={[10, -2.5]} color={PrimeColor.ultramarine} width={2} />

    <!-- V0 -->
    <Vector2D direction={v0} length={sliders.x} color={PrimeColor.red} />

    <!-- V1 -->
    <Vector2D direction={v1} length={sliders.y} color={PrimeColor.yellow} />

    <!-- U -->
    {#key sliders.x + sliders.y}
      <Vector2D direction={u} length={u.length()} color={PrimeColor.green} />
      <Vector2D origin={v0} direction={u} length={u.length()} color={PrimeColor.green} />
    {/key}
  </Canvas2D>
</div>
