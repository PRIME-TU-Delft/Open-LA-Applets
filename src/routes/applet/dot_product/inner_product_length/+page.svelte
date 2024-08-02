<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const controls = Controls.addSlider(4.5, 3, 6).addSlider(6, 4, 8);

  const v_q = $derived(new Vector3(2, 0, -1).normalize().multiplyScalar(controls[0]));
  const v_a = $derived(v_q.clone().add(new Vector3(0, 1, 0).multiplyScalar(controls[1])));
  const v_p = $derived(v_q.clone().projectOnVector(new Vector3(1, 0, 0)));

  const v_len = $derived(Math.sqrt(controls[0] * controls[0] + controls[1] * controls[1]));

  const formulas = $derived.by(() => {
    const f1 = new Formula('OQ &= \\$', controls[0], PrimeColor.raspberry);
    const f2 = new Formula('QA &= \\$', controls[0], PrimeColor.yellow);
    const f3 = new Formula('OA &= || \\mathbf{v} || = \\sqrt{\\$1^2 + \\$2^2}')
      .addParam(1, controls[0], PrimeColor.raspberry)
      .addParam(2, controls[1], PrimeColor.yellow);
    const f4 = new Formula('OA &=  \\$', v_len, PrimeColor.blue);

    const formulas = new Formulas(f1, f2, f3, f4).align();

    return formulas;
  });
</script>

<Canvas3D {controls} {formulas} cameraPosition={new Vector3(2.73, 13.56, 10.42)}>
  <!-- Vector q [Red] -->
  <Vector3D direction={v_q} color={PrimeColor.raspberry} length={controls[0]} />
  <Latex3D latex={'Q'} position={v_q} color={PrimeColor.raspberry} fontSize={1.1} />

  <!-- Vector a [Yellow] -->
  <Vector3D
    origin={v_q}
    direction={new Vector3(0, 1, 0)}
    color={PrimeColor.yellow}
    length={controls[1]}
  />
  <Latex3D latex={'A'} position={v_a} color={PrimeColor.yellow} fontSize={1.3} />

  <!-- Vector v [Blue] -->
  <Vector3D direction={v_a} color={PrimeColor.blue} length={v_len} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={v_a
      .clone()
      .multiplyScalar(0.5)
      .add(new Vector3(-0.7, -0.7, 0))}
    color={PrimeColor.blue}
  />

  <!-- Helper green lines -->
  <Vector3D color={PrimeColor.darkGreen} direction={v_p} length={v_p.length()} />
  <Vector3D
    direction={new Vector3(0, 0, -1)}
    origin={v_p}
    color={PrimeColor.darkGreen}
    length={-v_q.z}
  />

  <!-- Angle green lines -->
  <Angle3D
    forceRightAngle
    vs={[v_p.clone().multiplyScalar(-1), new Vector3(0, 0, -1)]}
    origin={v_p}
    size={0.5}
  />

  <!-- Angle Red and Yellow -->
  <Angle3D
    forceRightAngle
    vs={[new Vector3(0, 1, 0), v_q.clone().multiplyScalar(-1)]}
    size={1}
    origin={v_q}
  />

  <!-- Helper striped lines -->
  <Vector3D
    direction={v_q}
    origin={new Vector3(0, controls[1], 0)}
    color={'black'}
    isDashed
    length={controls[0]}
  />
  <Vector3D isDashed origin={new Vector3(0, 0, v_a.z)} color="black" length={v_p.x} />

  <!--  a_1-->

  <Latex3D latex={'a_1'} position={v_p} extend={0.5} />

  <Latex3D latex={'a_2'} position={new Vector3(0, 0, v_a.z)} extend={0.5} />
  <Point3D position={new Vector3(0, 0, v_a.z)} color={PrimeColor.black} />

  <Latex3D latex={'a_3'} position={new Vector3(-0.3, controls[1], 0)} extend={0.5} />
  <Point3D position={new Vector3(0, controls[1], 0)} color={PrimeColor.black} />

  <Axis3D showNumbers floor axisLength={10} />
</Canvas3D>
