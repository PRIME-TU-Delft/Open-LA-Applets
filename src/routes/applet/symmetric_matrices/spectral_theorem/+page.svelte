<script lang="ts">
  import { setContext } from 'svelte';
  setContext('dontScaleWithDefaultZoom', true);
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Matrix3 } from 'three';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import ImplicitFunction2D from '$lib/d3/ImplicitFunction2D.svelte';

  let direction_e1 = new Vector2(1, 0);
  let direction_e2 = new Vector2(0, 1);
  let t = new Matrix3().set(1, 2, 0, 2, -2, 0, 0, 0, 1);

  let transformed_e1 = direction_e1.clone().applyMatrix3(t);
  let transformed_e2 = direction_e2.clone().applyMatrix3(t);

  let direction_q1 = new Vector2(2 / Math.sqrt(5), 1 / Math.sqrt(5));
  let direction_q2 = new Vector2(-1 / Math.sqrt(5), 2 / Math.sqrt(5));

  let transformed_q1 = direction_q1.clone().applyMatrix3(t);
  let transformed_q2 = direction_q2.clone().applyMatrix3(t);
</script>

<Canvas2D
  axis={{ showAxisNumbersX: false, showAxisNumbersY: false }}
  cameraZoom={2}
  splitCanvas2DProps={{
    cameraZoom: 2,
    axis: {
      showAxisNumbersX: false,
      showAxisNumbersY: false
    }
  }}
>
  <Vector2D direction={direction_e1} length={direction_e1.length()} color={PrimeColor.cyan} />
  <Vector2D direction={direction_e2} length={direction_e2.length()} color={PrimeColor.cyan} />

  <Vector2D direction={transformed_e1} length={transformed_e1.length()} color={PrimeColor.red} />
  <Vector2D direction={transformed_e2} length={transformed_e2.length()} color={PrimeColor.red} />

  <Latex2D
    latex={'\\text{e}_1'}
    position={direction_e1}
    offset={new Vector2(0.15, 0)}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex={'\\text{e}_2'}
    position={direction_e2}
    offset={new Vector2(-0.6, 0)}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex={'\\text{T}(\\text{e}_1)'}
    position={transformed_e1}
    offset={new Vector2(-1.2, 0)}
    color={PrimeColor.red}
  />
  <Latex2D
    latex={'\\text{T}(\\text{e}_2)'}
    position={transformed_e2}
    offset={new Vector2(0.15, 0)}
    color={PrimeColor.red}
  />

  <Circle2D color={PrimeColor.darkGreen} />

  <ImplicitFunction2D
    zeroFunc={(x, y) => 8 * x * x + 4 * x * y + 5 * y * y - 36}
    color="#A50034"
    stepSize={0.15}
    width={0.06}
    maxDepth={6}
  />

  {#snippet splitCanvas2DChildren()}
    <Vector2D direction={transformed_q1} length={transformed_q1.length()} color={PrimeColor.red} />
    <Vector2D direction={transformed_q2} length={transformed_q2.length()} color={PrimeColor.red} />

    <Vector2D direction={direction_q1} length={direction_q1.length()} color={PrimeColor.cyan} />
    <Vector2D direction={direction_q2} length={direction_q2.length()} color={PrimeColor.cyan} />

    <Circle2D color={PrimeColor.darkGreen} />
    <ImplicitFunction2D
      zeroFunc={(x, y) => 8 * x * x + 4 * x * y + 5 * y * y - 36}
      color="#A50034"
      stepSize={0.15}
      width={0.06}
      maxDepth={6}
    />

    <Latex2D
      latex={'\\text{q}_1'}
      position={direction_q1}
      offset={new Vector2(0.15, 0)}
      color={PrimeColor.cyan}
    />
    <Latex2D
      latex={'\\text{q}_2'}
      position={direction_q2}
      offset={new Vector2(-0.3, 0.6)}
      color={PrimeColor.cyan}
    />
    <Latex2D
      latex={'\\text{T}(\\text{q}_1)'}
      position={transformed_q1}
      offset={new Vector2(0.15, 0.15)}
      color={PrimeColor.red}
    />
    <Latex2D
      latex={'\\text{T}(\\text{q}_2)'}
      position={transformed_q2}
      offset={new Vector2(0.15, 0)}
      color={PrimeColor.red}
    />
  {/snippet}
</Canvas2D>
