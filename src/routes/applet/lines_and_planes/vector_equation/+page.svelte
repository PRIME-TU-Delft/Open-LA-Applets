<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import NumberFlow from '@number-flow/svelte';
  import { Vector2 } from 'three';
  import { _ } from 'svelte-i18n';

  const controls = Controls.addSlider(1, -5, 5, 0.5, PrimeColor.darkGreen, {
    label: 'r',
    labelFormat
  });

  const u = new Vector2(-2, 1);
  const v0 = new Vector2(5, 0);

  const v1 = $derived(v0.clone().add(u.clone().multiplyScalar(controls[0])));

  const formulas = $derived.by(() => {
    const f1 = new Formula('\\mathbf{v}_1 &= \\mathbf{v}_0 + r \\mathbf{u}');
    const f2 = new Formula(
      '\\begin{pmatrix} \\$1 \\\\ \\$2 \\end{pmatrix} &= \\begin{pmatrix} \\$3  \\\\ \\$4 \\end{pmatrix} + \\$5 \\begin{pmatrix} \\$6 \\\\ \\$7 \\end{pmatrix}'
    )
      .addAutoParam(round(v1.x, 1), PrimeColor.yellow)
      .addAutoParam(round(v1.y, 1), PrimeColor.yellow)
      .addAutoParam(round(v0.x, 1), PrimeColor.raspberry)
      .addAutoParam(round(v0.y, 1), PrimeColor.raspberry)
      .addAutoParam(controls[0].toFixed(1), PrimeColor.darkGreen)
      .addAutoParam(round(u.x, 1), PrimeColor.darkGreen)
      .addAutoParam(round(u.y, 1), PrimeColor.darkGreen);

    return new Formulas(f1, f2).align();
  });
</script>

{#snippet labelFormat(value: number)}
  <NumberFlow {value} />
{/snippet}

<Canvas2D
  {controls}
  {formulas}
  showFormulasDefault
  title={$_('applets.lines_and_planes.parametric_vector_equation.title')}
>
  <!-- Line L -->
  <InfiniteLine2D origin={v0} direction={u} color={PrimeColor.cyan} />

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
        offset={new Vector2(0.1, 0.5)}
        color={PrimeColor.darkGreen}
      />
    {/snippet}
  </Vector2D>

  {#if controls[0] > 0}
    <Vector2D
      origin={v0}
      direction={u}
      length={u.length() * controls[0]}
      color={PrimeColor.darkGreen}
    />
  {:else}
    <Point2D position={v1} color={PrimeColor.darkGreen} />
  {/if}

  <Latex2D
    latex={'r \\cdot \\mathbf{u}'}
    position={v0.clone().add(
      u
        .clone()
        .normalize()
        .multiplyScalar(controls[0] * u.length())
    )}
    offset={new Vector2(0.3, 0.4)}
    color={PrimeColor.darkGreen}
  />
</Canvas2D>
