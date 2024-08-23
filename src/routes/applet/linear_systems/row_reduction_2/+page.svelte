<script lang="ts">
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import { controls } from './transitionSteps';

  const formulas = $derived.by(() => {
    const r = (x: number) => round(x, 1);

    const [r1, r2, r3] = controls[0];
    const f1 = new Formula(`\\begin{bmatrix} 
        \\textcolor{${PrimeColor.raspberry}}{${r(r1.x)}} & \\textcolor{${PrimeColor.raspberry}}{${r(r1.y)}} 
        & \\textcolor{${PrimeColor.raspberry}}{${r(r1.z)}} & ${r(r1.w)} \\\\
        \\textcolor{${PrimeColor.darkGreen}}{${r(r2.x)}} & \\textcolor{${PrimeColor.darkGreen}}{${r(r2.y)}} 
        & \\textcolor{${PrimeColor.darkGreen}}{${r(r2.z)}} & ${r(r2.w)} \\\\
        \\textcolor{${PrimeColor.yellow}}{${r(r3.x)}} & \\textcolor{${PrimeColor.yellow}}{${r(r3.y)}} 
        & \\textcolor{${PrimeColor.yellow}}{${r(r3.z)}} & ${r(r3.w)} \\\\
      \\end{bmatrix}`);

    return [f1];
  });
</script>

<Canvas3D {formulas} {controls}>
  {@const v0 = new Vector3(controls[0][0].y, controls[0][0].z, controls[0][0].x)}
  {@const v1 = new Vector3(controls[0][1].y, controls[0][1].z, controls[0][1].x)}
  {@const v2 = new Vector3(controls[0][2].y, controls[0][2].z, controls[0][2].x)}
  {@const v3 = new Vector3(controls[0][1].w, controls[0][2].w, controls[0][0].w)}

  <Vector3D direction={v0} length={v0.length()} color={PrimeColor.raspberry} />
  <Vector3D direction={v1} length={v1.length()} color={PrimeColor.darkGreen} />
  <Vector3D direction={v2} length={v2.length()} color={PrimeColor.yellow} />
  <Vector3D direction={v3} length={v3.length()} color={PrimeColor.black} />

  <Axis3D showNumbers />
</Canvas3D>
