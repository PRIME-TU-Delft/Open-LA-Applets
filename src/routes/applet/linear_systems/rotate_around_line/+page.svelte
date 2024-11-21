<script>
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import InfiniteLine3D from '$lib/threlte/InfiniteLine3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector4 } from 'three';

  let eq1 = new Vector4(1, 3, -2, 4);
  let eq2 = new Vector4(3, 7, -2, 8);

  const controls = Controls.addSlider(0, -3, 3, 0.1, PrimeColor.raspberry, {
    label: 'a',
    valueFn: (v) => round(v, 1).toString()
  }).addSlider(0, -3, 3, 0.1, PrimeColor.darkGreen, {
    label: 'b',
    valueFn: (v) => round(v, 1).toString()
  });

  const p1 = $derived(eq1.clone().add(eq2.clone().multiplyScalar(controls[0])));
  const p2 = $derived(eq2.clone().add(eq1.clone().multiplyScalar(controls[1])));

  const COLOR = [PrimeColor.raspberry, PrimeColor.darkGreen, PrimeColor.yellow];

  const formulas = $derived.by(() => {
    const f1 = new Formula(
      `\\left(\\hspace{-5pt}\\begin{array}{ccc|c}
      ${p1
        .toArray()
        .map((x) => `\\textcolor{${PrimeColor.raspberry}}{${round(x, 1)}}`)
        .join(' & ')} \\\\
      ${p2
        .toArray()
        .map((x) => `\\textcolor{${PrimeColor.darkGreen}}{${round(x, 1)}}`)
        .join(' & ')}
      \\end{array}\\hspace{-5pt}\\right)`
    );

    return [f1];
  });
</script>

<Canvas3D {controls} {formulas} showFormulasDefault>
  {#each [p1, p2] as v, i}
    {@const a = v.x}
    {@const b = v.y}
    {@const c = v.z}
    {@const d = v.w}
    {@const normal = new MathVector3(v.x, v.y, v.z)}

    <PlaneFromNormal
      {normal}
      position={normal.clone().multiplyScalar(d / (a * a + b * b + c * c))}
      color={COLOR[i]}
      opacity={0.1}
    />
  {/each}

  <Vector3D
    origin={new MathVector3(2, 0, -1)}
    direction={new MathVector3(-4, 2, 1)}
    radius={0.5}
    length={5}
    hideHead
    color={PrimeColor.yellow}
  />

  <Vector3D
    origin={new MathVector3(2, 0, -1)}
    direction={new MathVector3(-4, 2, 1)}
    radius={0.5}
    length={-5}
    hideHead
    color={PrimeColor.yellow}
  />

  <Axis3D showNumbers />
</Canvas3D>
