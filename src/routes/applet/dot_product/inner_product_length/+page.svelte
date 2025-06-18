<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import NumberFlow from '@number-flow/svelte';
  import { Vector3 } from 'three';

  const slider_step = 0.5;
  let controls = Controls.addSlider(-3, -5, 5, slider_step, PrimeColor.yellow, {
    label: 'x',
    labelFormat
  })
    .addSlider(3, -5, 5, slider_step, PrimeColor.yellow, {
      label: 'y',
      labelFormat
    })
    .addSlider(6, -5, 6, slider_step, PrimeColor.yellow, {
      label: 'z',
      labelFormat
    });

  const A = $derived(new Vector3(controls[1], controls[2], controls[0]));
  const Q = $derived(new Vector3(controls[1], 0, controls[0]));
  const v_p = $derived(new Vector3(controls[1], 0, 0));

  const formulas = $derived.by(() => {
    const f0 = new Formula('A = ( \\$1 , \\$2 , \\$3 )')
      .addParam(1, round(A.z), PrimeColor.yellow)
      .addParam(2, round(A.x), PrimeColor.yellow)
      .addParam(3, round(A.y), PrimeColor.yellow);
    const f1 = new Formula('OQ = \\$', round(Q.length()), PrimeColor.raspberry);
    const f2 = new Formula('QA = \\$', round(controls[2]), PrimeColor.yellow);
    const f3 = new Formula(
      `OA = || \\textcolor{${PrimeColor.blue}}{\\mathbf{v}} || = \\sqrt{\\$1^2 + \\$2^2}`
    )
      .addParam(1, round(Q.length()), PrimeColor.raspberry)
      .addParam(2, round(controls[2]), PrimeColor.yellow);
    const f4 = new Formula('OA =  \\$', A.length(), PrimeColor.blue);

    return [f0, f1, f2, f3, f4];
  });
</script>

{#snippet labelFormat(value: number)}
  <NumberFlow {value} />
{/snippet}

<Canvas3D {controls} {formulas} cameraPosition={new Vector3(2.73, 13.56, 10.42)}>
  <!-- Vector q [raspberry] -->
  <Vector3D direction={Q} color={PrimeColor.raspberry} length={Q.length()} />
  <Latex3D latex="Q" position={Q} color={PrimeColor.raspberry} fontSize={1.1} />

  <!-- Vector a [Yellow] -->
  <Vector3D
    origin={Q}
    direction={new Vector3(0, A.y, 0)}
    color={PrimeColor.yellow}
    length={Math.abs(A.y)}
  />
  <Latex3D latex="A" position={A} color={PrimeColor.yellow} fontSize={1.3} />

  <!-- Vector v [Blue] -->
  <Vector3D direction={A} color={PrimeColor.blue} length={A.length()} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={A.clone()
      .multiplyScalar(0.5)
      .add(new Vector3(-0.4, -0.4, 0))}
    color={PrimeColor.blue}
  />

  <!-- Helper green lines -->
  <Vector3D color={PrimeColor.darkGreen} direction={v_p} length={v_p.length()} />

  <Vector3D
    direction={new Vector3(0, 0, Q.z)}
    origin={v_p}
    color={PrimeColor.darkGreen}
    length={Math.abs(Q.z)}
  />

  <!-- Angle green lines -->
  <Angle3D
    forceRightAngle
    vs={[new Vector3(-A.x, 0, 0), new Vector3(0, 0, A.z)]}
    origin={v_p}
    size={0.5}
  />

  <!-- Angle red and Yellow -->
  <Angle3D
    forceRightAngle
    vs={[new Vector3(0, A.y, 0), Q.clone().multiplyScalar(-1)]}
    size={1}
    origin={Q}
  />

  <!-- a_1 -->
  <Latex3D latex="a_1" position={new Vector3(0, 0, A.z)} extend={0.5} />
  <Point3D position={new Vector3(0, 0, A.z)} color={PrimeColor.black} />
  <Vector3D
    direction={v_p}
    origin={new Vector3(0, 0, Q.z)}
    color="black"
    length={Math.abs(v_p.length())}
    isDashed
  />

  <!--  a_2-->
  <Latex3D latex="a_2" position={v_p} extend={0.5} />
  <Latex3D
    latex="P"
    position={v_p}
    extend={0.5}
    offset={new Vector3(-0.5, -0.75, 0)}
    color={PrimeColor.darkGreen}
  />

  <!-- a_3 -->
  <Latex3D latex="a_3" position={new Vector3(-0.3, A.y, 0)} extend={0.5} />
  <Point3D position={new Vector3(0, A.y, 0)} color={PrimeColor.black} />
  <Vector3D
    direction={Q}
    origin={new Vector3(0, A.y, 0)}
    color="black"
    length={Q.length()}
    isDashed
  />

  <Axis3D showNumbers floor axisLength={10} />
</Canvas3D>
