<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const draggables = [
    new Draggable(new Vector2(-2, 1), PrimeColor.darkGreen, 'u', Draggable.snapToGrid),
    new Draggable(new Vector2(5, 0), PrimeColor.raspberry, 'v0', Draggable.snapToGrid)
  ];

  const controls = Controls.addSlider(1, -5, 5, 0.5, PrimeColor.darkGreen, 'k', (x) =>
    round(x).toString()
  );

  const v0 = $derived(draggables[1].value);
  const u = $derived(draggables[0].value);

  const v1 = $derived(v0.clone().add(u.clone().multiplyScalar(controls[0])));
  const dir_L = $derived(v1.clone().sub(v0.clone()));

  const formulas = $derived.by(() => {
    const f1 = new Formula('\\mathbf{v}_1 &= \\mathbf{v}_0 + k \\cdot \\mathbf{u}');
    const f2 = new Formula(
      '\\begin{bmatrix} \\$1 \\\\ \\$2 \\end{bmatrix} &= \\begin{bmatrix} \\$3  \\\\ \\$4 \\end{bmatrix} + \\$5 \\begin{bmatrix} \\$6 \\\\ \\$7 \\end{bmatrix}'
    )
      .addAutoParam(round(v1.x), PrimeColor.yellow)
      .addAutoParam(round(v1.y), PrimeColor.yellow)
      .addAutoParam(round(v0.x), PrimeColor.raspberry)
      .addAutoParam(round(v0.y), PrimeColor.raspberry)
      .addAutoParam(controls[0].toFixed(2), PrimeColor.darkGreen)
      .addAutoParam(round(u.x), PrimeColor.darkGreen)
      .addAutoParam(round(u.y), PrimeColor.darkGreen);

    return new Formulas(f1, f2).align();
  });
</script>

<Canvas2D {draggables} title="A parametric vector of a line">
  <!-- Line L -->
  <InfiniteLine2D origin={v0} direction={dir_L} color={PrimeColor.cyan} />

  <!-- V0 -->
  <Vector2D direction={v0} length={v0.length()} color={PrimeColor.raspberry}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{v}_0'}
        position={endPoint}
        offset={new Vector2(0.1, 0.2)}
        color={PrimeColor.raspberry}
      />
      <Latex2D
        latex={'\\mathcal{L}_1'}
        offset={u.clone().multiplyScalar(-0.2).add(new Vector2(-0.2, -0.2))}
        position={endPoint}
        color={PrimeColor.blue}
      />
    {/snippet}
  </Vector2D>

  <!-- V1 -->
  <Vector2D direction={v1} length={v1.length()} color={PrimeColor.yellow}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{v}_1'}
        position={endPoint}
        offset={new Vector2(-0.3, -0.3)}
        color={PrimeColor.yellow}
      />
    {/snippet}
  </Vector2D>

  <!-- U -->
  <Vector2D direction={u} length={u.length()} color={PrimeColor.darkGreen}>
    {#snippet children(endPoint)}
      <Latex2D
        latex={'\\mathbf{u}'}
        position={endPoint}
        offset={new Vector2(0.1, 0.2)}
        color={PrimeColor.darkGreen}
      />
    {/snippet}
  </Vector2D>

  <Vector2D
    origin={v0}
    direction={u}
    length={u.length() * controls[0]}
    color={PrimeColor.darkGreen}
  >
    {#snippet children(endPoint)}
      <Latex2D
        latex={'k \\cdot \\mathbf{u}'}
        position={endPoint}
        offset={new Vector2(0.2, 0.3)}
        color={PrimeColor.darkGreen}
      />
    {/snippet}
  </Vector2D>
</Canvas2D>
