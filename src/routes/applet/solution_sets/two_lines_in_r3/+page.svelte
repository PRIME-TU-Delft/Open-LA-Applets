<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import InfiniteLine3D from '$lib/threlte/InfiniteLine3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import NumberFlow from '@number-flow/svelte';

  const controls = Controls.addSlider(4, -5, 6, 0.5, PrimeColor.raspberry, {
    label: 'a',
    labelFormat
  });

  const v = new MathVector3(-4, 3, 1);

  const v_offset = $derived(new MathVector3(-controls[0], controls[0], 0));

  const formulas = $derived.by(() => {
    const minusA = round(-controls[0]);

    const f1 = new Formula(
      `\\$1: \\Bigg\\lbrace 
        \\begin{pmatrix}\\$2 \\\\ \\$3 \\\\0 \\end{pmatrix} + 
        t \\space \\begin{pmatrix}-4 \\\\ 3 \\\\ 1 \\end{pmatrix} \\space | \\space
        t \\in \\mathbb{R} \\Bigg\\rbrace`
    )
      .addAutoParam('\\mathcal{L_2}', PrimeColor.darkGreen)
      .addAutoParam(minusA, PrimeColor.raspberry)
      .addAutoParam(round(controls[0]), PrimeColor.raspberry);

    return [f1];
  });
</script>

{#snippet labelFormat(value: number)}
  <NumberFlow {value} />
{/snippet}

<Canvas3D {controls} {formulas} cameraPosition={new MathVector3(15.5, -6, 4.5)} showFormulasDefault>
  <!-- Default -->
  <Vector3D direction={v} length={v.length()} color={PrimeColor.yellow} alwaysOnTop />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={v}
    extend={0.5}
    offset={new MathVector3(0.5, 0, 0)}
    color={PrimeColor.yellow}
  />

  <InfiniteLine3D radius={0.5} direction={v} color={PrimeColor.blue} />

  <Latex3D
    latex={'\\mathcal{L_1}'}
    position={v.clone().multiplyScalar(-0.5)}
    extend={0.5}
    offset={new MathVector3(0.75, 0.1, 0)}
    color={PrimeColor.blue}
  />

  <!-- Extended -->
  <Vector3D
    origin={v_offset}
    direction={v}
    length={v.length()}
    color={PrimeColor.yellow}
    alwaysOnTop
  />
  <Latex3D
    offset={v_offset.clone().add(new MathVector3(0.5, 0, 0))}
    latex={'\\mathbf{v}'}
    position={v}
    extend={0.5}
    color={PrimeColor.yellow}
  />

  <InfiniteLine3D radius={0.5} origin={v_offset} direction={v} color={PrimeColor.darkGreen} />

  <Latex3D
    latex={'\\mathcal{L_2}'}
    position={v_offset.clone().add(v.clone().multiplyScalar(-0.75))}
    extend={0.5}
    offset={new MathVector3(0.75, 0.1, 0)}
    color={PrimeColor.darkGreen}
  />

  <!-- R0 -->
  <Vector3D direction={v_offset} length={v_offset.length()} color={PrimeColor.raspberry} />
  <Latex3D
    latex={'\\mathbf{r_0}'}
    position={v_offset}
    extend={0.5}
    offset={new MathVector3(0.5, 0, 0)}
    color={PrimeColor.raspberry}
  />

  <Axis3D />
</Canvas3D>
