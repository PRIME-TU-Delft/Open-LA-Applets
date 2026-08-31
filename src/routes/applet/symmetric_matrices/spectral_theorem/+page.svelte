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
  import { Controls } from '$lib/controls/Controls';
  import Matrix2 from '$lib/utils/Matrix2.svelte';
  import { DiagonalMatrix } from '$lib/controls/DiagonalMatrix.svelte';

  const controls = Controls.add(
    new DiagonalMatrix(new Matrix2(1, 2, 2, -2), 'T', PrimeColor.raspberry)
  );

  let direction_e1 = new Vector2(1, 0);
  let direction_e2 = new Vector2(0, 1);
  let t = $derived.by(() => {
    return new Matrix3().set(
      controls[0].tl,
      controls[0].tr,
      0,
      controls[0].bl,
      controls[0].br,
      0,
      0,
      0,
      1
    );
  });

  let transformed_e1 = $derived(direction_e1.clone().applyMatrix3(t));
  let transformed_e2 = $derived(direction_e2.clone().applyMatrix3(t));

  let direction_q1 = new Vector2(2 / Math.sqrt(5), 1 / Math.sqrt(5));
  let direction_q2 = new Vector2(-1 / Math.sqrt(5), 2 / Math.sqrt(5));

  let transformed_q1 = $derived(direction_q1.clone().applyMatrix3(t));
  let transformed_q2 = $derived(direction_q2.clone().applyMatrix3(t));

  const zeroFuncE = (x: number, y: number) => {
    const a = transformed_e1;
    const b = transformed_e2;
    const det = a.x * b.y - a.y * b.x;
    if (Math.abs(det) < 1e-8) {
      return 1;
    }
    const qx = (b.y * x - b.x * y) / det;
    const qy = (-a.y * x + a.x * y) / det;
    return qx * qx + qy * qy - 1;
  };

  const zeroFuncQ = (x: number, y: number) => {
    const a = transformed_q1;
    const b = transformed_q2;
    const det = a.x * b.y - a.y * b.x;
    if (Math.abs(det) < 1e-8) {
      return 1;
    }
    const qx = (b.y * x - b.x * y) / det;
    const qy = (-a.y * x + a.x * y) / det;
    return qx * qx + qy * qy - 1;
  };
</script>

<Canvas2D
  {controls}
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
    zeroFunc={zeroFuncE}
    color={PrimeColor.raspberry}
    stepSize={0.4}
    maxDepth={4}
  />

  {#snippet splitCanvas2DChildren()}
    <Vector2D direction={transformed_q1} length={transformed_q1.length()} color={PrimeColor.red} />
    <Vector2D direction={transformed_q2} length={transformed_q2.length()} color={PrimeColor.red} />

    <Vector2D direction={direction_q1} length={direction_q1.length()} color={PrimeColor.cyan} />
    <Vector2D direction={direction_q2} length={direction_q2.length()} color={PrimeColor.cyan} />

    <Circle2D color={PrimeColor.darkGreen} />
    <ImplicitFunction2D
      zeroFunc={zeroFuncQ}
      color={PrimeColor.raspberry}
      stepSize={0.4}
      maxDepth={4}
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
