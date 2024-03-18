<script lang="ts">
  import { Angle3D, Axis3D, Canvas3D, Latex3D, Point3D, Vector3D } from '$lib/threlte-components';
  import { Controls } from '$lib/utils/Controls';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const slider_step = 0.5;
  let controls = Controls.addSlider(-3, -5, 5, slider_step, PrimeColor.yellow)
    .addSlider(3, -5, 5, slider_step, PrimeColor.yellow)
    .addSlider(6, -5, 5, slider_step, PrimeColor.yellow);
  let formulas: Formula[] = [];

  $: A = new Vector3(controls[1], controls[2], controls[0]);
  $: Q = new Vector3(controls[1], 0, controls[0]);
  $: v_p = new Vector3(controls[1], 0, 0);

  $: v_len = A.length();

  function setFormulas(c0: number, c1: number, len: number) {
    const f1 = new Formula('OQ = \\$', c0, PrimeColor.raspberry);
    const f2 = new Formula('QA = \\$', c1, PrimeColor.yellow);
    const f3 = new Formula('OA = || \\mathbf{v} || = \\sqrt{\\$1^2 + \\$2^2}')
      .addParam(1, c0, PrimeColor.raspberry)
      .addParam(2, c1, PrimeColor.yellow);
    const f4 = new Formula('OA =  \\$', len, PrimeColor.blue);

    formulas = [f1, f2, f3, f4];
  }

  $: setFormulas(Q.length(), controls[1], v_len);
</script>

<Canvas3D bind:controls {formulas} cameraPosition={new Vector3(2.73, 13.56, 10.42)}>
  <!-- Vector q [raspberry] -->
  <Vector3D direction={Q} color={PrimeColor.raspberry} length={Q.length()} />
  <Latex3D latex={'Q'} position={Q} color={PrimeColor.raspberry} size={1.1} />

  <!-- Vector a [Yellow] -->
  <Vector3D
    origin={Q}
    direction={new Vector3(0, A.y, 0)}
    color={PrimeColor.yellow}
    length={Math.abs(A.y)}
  />
  <Latex3D latex={'A'} position={A} color={PrimeColor.yellow} size={1.3} />

  <!-- Vector v [Blue] -->
  <Vector3D direction={A} color={PrimeColor.blue} length={v_len} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={A.clone().multiplyScalar(0.5).add(new Vector3(-0.4, -0.4, 0))}
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

  <!--  a_1-->
  <Latex3D latex={'a_1'} position={v_p} offset={0.5} />

  <!-- a_2 -->
  <Latex3D latex={'a_2'} position={new Vector3(0, 0, A.z)} offset={0.5} />
  <Point3D position={new Vector3(0, 0, A.z)} color={PrimeColor.black} />
  <Vector3D
    striped
    direction={v_p}
    origin={new Vector3(0, 0, Q.z)}
    color="black"
    length={Math.abs(v_p.length())}
  />

  <!-- a_3 -->
  <Latex3D latex={'a_3'} position={new Vector3(-0.3, A.y, 0)} offset={0.5} />
  <Point3D position={new Vector3(0, A.y, 0)} color={PrimeColor.black} />
  <Vector3D
    direction={Q}
    origin={new Vector3(0, A.y, 0)}
    color={'black'}
    striped
    length={Q.length()}
  />

  <Axis3D showNumbers floor axisLength={10} />
</Canvas3D>
