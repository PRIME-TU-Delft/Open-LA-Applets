<script>
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { Vector2 } from 'three';
  import TransformedAxis from './TransformedAxis.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { round } from '$lib/utils/MathLib';
  import { Formula } from '$lib/utils/Formulas';

  const b1 = new Vector2(1, 3);
  const b2 = new Vector2(2, 1);

  const draggables = [new Draggable(new Vector2(6, -2))];

  const x = $derived(draggables[0].value.x);
  const y = $derived(draggables[0].value.y);

  const c1 = $derived(x + (2 / 5) * (y - 3 * x));
  const c2 = $derived((-1 / 5) * (y - 3 * x));

  const formulas = $derived.by(() => {
    const vec = `\\begin{bmatrix} ${round(x)} \\\\ ${round(y)} \\end{bmatrix}`;

    const f1 = new Formula('\\$1 = \\$2 \\$3 + \\$4 \\$5')
      .addAutoParam(vec, PrimeColor.blue)
      .addAutoParam(round(c1), PrimeColor.cyan)
      .addAutoParam('\\mathbf{b_1}', PrimeColor.raspberry)
      .addAutoParam(round(c2), PrimeColor.cyan)
      .addAutoParam('\\mathbf{b_2}', PrimeColor.raspberry);

    return [f1];
  });
</script>

<Canvas2D customAxis {draggables} {formulas} showFormulasDefault cameraZoom={0.5}>
  <TransformedAxis basis={[b1, b2]} />

  <!-- Basis -->
  <Vector2D direction={b1} length={b1.length()} color={PrimeColor.raspberry} />
  <Latex2D latex={'\\mathbf{b_1}'} position={b1} extend={0.2} color={PrimeColor.raspberry} />

  <Vector2D direction={b2} length={b2.length()} color={PrimeColor.raspberry} />
  <Latex2D latex={'\\mathbf{b_2}'} position={b2} extend={0.2} color={PrimeColor.raspberry} />

  <!-- Compound -->
  <Vector2D
    direction={b1.clone().multiplyScalar(c1)}
    length={b1.clone().multiplyScalar(c1).length()}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex={`\\mathbf{${round(c1)} b_1}`}
    position={b1.clone().multiplyScalar(c1)}
    extend={0.2}
    color={PrimeColor.cyan}
  />

  <Vector2D
    origin={b1.clone().multiplyScalar(c1)}
    direction={b2.clone().multiplyScalar(c2)}
    length={b2.clone().multiplyScalar(c2).length()}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex={`\\mathbf{${round(c2)}b_2}`}
    offset={b1.clone().multiplyScalar(c1)}
    position={b2.clone().multiplyScalar(c2)}
    extend={0.2}
    color={PrimeColor.cyan}
  />
</Canvas2D>
