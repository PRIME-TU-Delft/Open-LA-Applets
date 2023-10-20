<script lang="ts">
  import { Canvas2D, Latex2D, Line2D, Vector2D } from '$lib/d3-components';
  import { GridType } from '$lib/d3-components/grids/GridTypes';

  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Slider, Sliders } from '$lib/utils/Slider';
  import { Vector2 } from 'three';

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

<Canvas2D bind:sliders>
  <Line2D
    start={v0.clone().sub(u.clone().multiplyScalar(4))}
    end={v1.clone().add(u.clone().multiplyScalar(5))}
    color={PrimeColor.ultramarine}
    width={0.1}
  />

  <!-- V0 -->
  <Vector2D direction={v0} length={sliders.x} color={PrimeColor.red} let:endPoint>
    <Latex2D
      latex={'\\mathbf{v}_0'}
      position={endPoint}
      offset={new Vector2(0.1, 0.1)}
      color={PrimeColor.red}
    />
    <Latex2D
      latex={'L'}
      offset={u.clone().multiplyScalar(-0.2).add(new Vector2(-0.2, -0.2))}
      position={endPoint}
      color={PrimeColor.ultramarine}
    />
  </Vector2D>

  <!-- V1 -->
  <Vector2D direction={v1} length={sliders.y} color={PrimeColor.yellow} let:endPoint>
    <Latex2D
      latex={'\\mathbf{v}_1'}
      position={endPoint}
      offset={new Vector2(-0.2, -0.3)}
      color={PrimeColor.yellow}
    />
  </Vector2D>

  <!-- U -->
  {#key sliders.x + sliders.y}
    <Vector2D direction={u} length={u.length()} color={PrimeColor.green} let:endPoint>
      <Latex2D
        latex={'\\mathbf{u}'}
        position={endPoint}
        offset={new Vector2(0.1, 0.1)}
        color={PrimeColor.green}
      />
    </Vector2D>
    <Vector2D origin={v0} direction={u} length={u.length()} color={PrimeColor.green} let:endPoint>
      <Latex2D
        latex={'\\mathbf{u}'}
        position={endPoint}
        offset={new Vector2(0.1, 0.1)}
        color={PrimeColor.green}
      />
    </Vector2D>
  {/key}
</Canvas2D>
