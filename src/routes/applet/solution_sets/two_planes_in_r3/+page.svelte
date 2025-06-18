<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromPoints from '$lib/threlte/planes/PlaneFromPoints.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  // import { snippetFormatter } from '$lib/utils/SnippetFormatter'; TODO
  import NumberFlow from '@number-flow/svelte';
  import { Vector3 } from 'three';

  const controls = Controls.addSlider(7, 1, 10, 0.5, PrimeColor.raspberry, {
    label: 'a'
    // labelFormat: snippetFormatter<[number]>(labelFormat, [undefined])
  });

  const v1 = new MathVector3(-3, 1, 0);
  const v2 = new MathVector3(1, 0, 1);

  const v3 = $derived(new Vector3(0, 0, controls[0]));

  const formulas = $derived.by(() => {
    const f1 = new Formula(
      `\\$1: \\Bigg\\lbrace 
        \\begin{bmatrix}\\$2 \\\\ 0 \\\\0 \\end{bmatrix} + 
        s \\space \\begin{bmatrix}-3 \\\\ 1 \\\\ 0 \\end{bmatrix} + 
        t \\space \\begin{bmatrix}1 \\\\ 0 \\\\ 1 \\end{bmatrix} \\space | \\space
        s, t \\in \\mathbb{R} \\Bigg\\rbrace`
    )
      .addAutoParam('\\mathcal{P_2}', PrimeColor.darkGreen)
      .addAutoParam(round(controls[0], 1), PrimeColor.raspberry);

    return [f1];
  });
</script>

{#snippet labelFormat(value: number)}
  <NumberFlow {value} />
{/snippet}

<Canvas3D {controls} {formulas} cameraPosition={new Vector3(-8, 8, 12.5)} showFormulasDefault>
  <!-- Default -->
  <Vector3D direction={v1} length={v1.length()} color={PrimeColor.yellow} />
  <Latex3D latex={'\\mathbf{v_1}'} position={v1} extend={0.5} color={PrimeColor.yellow} />

  <Vector3D direction={v2} length={v2.length()} color={PrimeColor.orange} />
  <Latex3D latex={'\\mathbf{v_2}'} position={v2} extend={0.5} color={PrimeColor.orange} />

  <PlaneFromPoints points={[v1, v2, new Vector3()]} color={PrimeColor.blue} opacity={0.5} />

  <Latex3D
    latex={'\\mathcal{P_1}'}
    position={new Vector3(0, 0, 0)}
    extend={0.5}
    offset={v2.clone().multiplyScalar(4.25)}
    color={PrimeColor.blue}
  />

  <!-- Extended -->
  <Vector3D origin={v3} direction={v1} length={v1.length()} color={PrimeColor.yellow} />
  <Latex3D
    offset={v3}
    latex={'\\mathbf{v_1}'}
    position={v1}
    extend={0.5}
    color={PrimeColor.yellow}
  />

  <Vector3D origin={v3} direction={v2} length={v2.length()} color={PrimeColor.orange} />
  <Latex3D
    offset={v3}
    latex={'\\mathbf{v_2}'}
    position={v2}
    extend={0.5}
    color={PrimeColor.orange}
  />

  <PlaneFromPoints
    origin={v3}
    points={[v1, v2, new Vector3()]}
    color={PrimeColor.darkGreen}
    opacity={0.5}
  />

  <Latex3D
    latex={'\\mathcal{P_2}'}
    position={v3}
    extend={0.5}
    offset={v2.clone().multiplyScalar(4.5)}
    color={PrimeColor.darkGreen}
  />

  <!-- R_0 -->
  <Vector3D direction={v3} length={v3.length()} color={PrimeColor.raspberry} />
  <Latex3D latex={'\\mathbf{r_0}'} position={v3} extend={0.5} color={PrimeColor.raspberry} />

  <Axis3D />
</Canvas3D>
