<script lang="ts">
  import type { Controls } from '$lib/controls/Controls';
  import type { SlideShow } from '$lib/controls/SlideShow.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3, Vector4 } from 'three';

  type RowReductionProps = {
    cameraPosition?: Vector3;
    controls: Controls<unknown, readonly [SlideShow<Vector4[]>]>;
  };

  let { cameraPosition = new Vector3(5, 8, 14.5), controls }: RowReductionProps = $props();

  const COLOR = [PrimeColor.raspberry, PrimeColor.darkGreen, PrimeColor.yellow];

  const formulas = $derived.by(() => {
    function toColor(r: Vector4, color: string) {
      return r
        .toArray()
        .map((x) => round(x, 1))
        .map((x) => `\\textcolor{${color}}{${x}}`)
        .join(' & ');
    }

    const [r1, r2, r3] = controls[0];
    const f1 = new Formula(
      `\\left(\\hspace{-5pt}\\begin{array}{ccc|c}
      ${toColor(r1, PrimeColor.raspberry)} \\\\ 
      ${toColor(r2, PrimeColor.darkGreen)} \\\\ 
      ${toColor(r3, PrimeColor.yellow)}
      \\end{array}\\hspace{-5pt}\\right)`
    );

    return [f1];
  });
</script>

<Canvas3D {formulas} {controls} {cameraPosition} showFormulasDefault>
  {@const vs = controls[0]}

  {#each vs as v, i (i)}
    {@const a = v.x}
    {@const b = v.y}
    {@const c = v.z}
    {@const d = v.w}
    {@const normal = new MathVector3(v.x, v.y, v.z)}

    <PlaneFromNormal
      {normal}
      position={normal.clone().multiplyScalar(d / (a * a + b * b + c * c))}
      color={COLOR[i]}
    />
  {/each}

  <Axis3D showNumbers />
</Canvas3D>
