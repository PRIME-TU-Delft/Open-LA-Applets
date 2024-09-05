<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Matrix3, Vector2, Vector3 } from 'three';

  const controls = Controls.addSlider(
    0,
    0,
    2,
    1 / 20,
    PrimeColor.raspberry,
    'Angle',
    (x) => round(x, 2).toString() + 'π'
  );

  const A = new Matrix3(5 / 3, -2 / 3, 0, -1 / 3, 4 / 3, 0, 0, 0, 0);

  function rotationMatrix(angle: number) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix3(c, -s, 0, s, c, 0, 0, 0, 0);
  }

  const v1 = $derived.by(() => {
    const rotation = rotationMatrix(controls[0] * Math.PI);
    const v = new Vector3(2, 1, 0);
    v.applyMatrix3(rotation);

    return new Vector2(v.x, v.y);
  });
  const v2 = $derived.by(() => {
    const rotation = rotationMatrix(controls[0] * Math.PI);
    const v = new Vector3(1, 0, 0);
    v.applyMatrix3(rotation);

    return new Vector2(v.x, v.y);
  });

  function applyMatrixA(v: Vector2) {
    const v3 = new Vector3(v.x, v.y, 0);
    v3.applyMatrix3(A);
    return new Vector2(v3.x, v3.y);
  }

  const Av1 = $derived(applyMatrixA(v1));
  const Av2 = $derived(applyMatrixA(v2));

  const Av1Label = $derived.by(() => {
    const solutions = [
      { angle: 0.1, lambda: 1 },
      { angle: 0.7, lambda: 2 },
      { angle: 1.1, lambda: 1 },
      { angle: 1.7, lambda: 2 }
    ];

    const solution = solutions.find((v) => controls[0] === v.angle);

    if (solution) {
      return 'A\\mathbf{v_2}=' + solution.lambda + '\\mathbf{v_2}';
    }

    return 'A\\mathbf{v_2}\\neq\\lambda\\mathbf{v_2}';
  });
  const Av2Label = $derived.by(() => {
    const solutions = [
      { angle: 0.25, lambda: 1 },
      { angle: 0.85, lambda: 2 },
      { angle: 1.25, lambda: 1 },
      { angle: 1.85, lambda: 2 }
    ];

    const solution = solutions.find((v) => controls[0] === v.angle);

    if (solution) {
      return 'A\\mathbf{v_2}=' + solution.lambda + '\\mathbf{v_2}';
    }

    return 'A\\mathbf{v_2}\\neq\\lambda\\mathbf{v_2}';
  });

  const formulas = $derived.by(() => {
    const f1 = new Formula('A = \\frac{1}{3}\\begin{bmatrix} 5 & -2 \\\\ -1 & 4 \\end{bmatrix}');
    const f2 = new Formula(
      'v_1 = \\begin{bmatrix} \\$1 \\\\ \\$2 \\end{bmatrix} \\quad v_2 = \\begin{bmatrix} \\$3 \\\\ \\$4 \\end{bmatrix}'
    )
      .addAutoParam(round(v1.x, 1), PrimeColor.raspberry)
      .addAutoParam(round(v1.y, 1), PrimeColor.raspberry)
      .addAutoParam(round(v2.x, 1), PrimeColor.raspberry)
      .addAutoParam(round(v2.y, 1), PrimeColor.raspberry);

    return [f1, f2];
  });
</script>

<Canvas2D {controls} {formulas}>
  <!-- V1 -->
  <Vector2D direction={Av1} length={Av1.length()} color={PrimeColor.blue} />
  <Latex2D
    extend={0.5}
    offset={new Vector2(-0.25, 0.25)}
    latex={Av1Label}
    position={Av1}
    color={PrimeColor.blue}
  />

  <Vector2D direction={v1} length={v1.length()} color={PrimeColor.raspberry} />
  <Latex2D
    offset={new Vector2(-0.25, 0)}
    extend={0.5}
    latex={'\\mathbf{v_1}'}
    position={v1}
    color={PrimeColor.raspberry}
  />

  <!-- V2 -->
  {#snippet splitCanvas2DChildren()}
    <Vector2D direction={Av2} length={Av2.length()} color={PrimeColor.blue} />
    <Latex2D
      extend={0.5}
      offset={new Vector2(-0.25, 0.25)}
      latex={Av2Label}
      position={Av2}
      color={PrimeColor.blue}
    />

    <Vector2D direction={v2} length={v2.length()} color={PrimeColor.raspberry} />
    <Latex2D
      offset={new Vector2(-0.25, 0)}
      extend={0.5}
      latex={'\\mathbf{v_2}'}
      position={v2}
      color={PrimeColor.raspberry}
    />
  {/snippet}
</Canvas2D>
