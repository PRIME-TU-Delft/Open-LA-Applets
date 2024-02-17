<script>
  import { Axis3D, Canvas3D, Latex3D, Vector3D } from '$lib/threlte-components';
  import { Controls } from '$lib/utils/Controls';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const v_0 = new Vector3(-2, 3, 2);
  const u = new Vector3(2, 1, -1);

  let controls = Controls.addSlider(2, -1.5, 3, 0.1, PrimeColor.darkGreen);

  $: ru_len = controls[0] * u.length();
  $: formula = new Formula('r = \\$', controls[0], PrimeColor.darkGreen);
</script>

<Canvas3D
  formulas={[formula]}
  cameraPosition={new Vector3(3.31, 6.55, 15.68)}
  zoom={38}
  bind:controls
>
  <!-- Vector v_0 -->
  <Vector3D direction={v_0} color={PrimeColor.red} length={v_0.length()} />
  <Latex3D position={v_0} latex={'\\mathbf{v}_0'} offset={0.6} color={PrimeColor.red} />

  <!-- Vector r * u -->
  <Vector3D direction={u} color={PrimeColor.darkGreen} origin={v_0} length={ru_len} let:endPoint>
    <Latex3D
      position={endPoint}
      latex={`\\space r\\mathbf{u}`}
      offset={0.5}
      color={PrimeColor.darkGreen}
    />

    <!-- Vector v -->
    <Vector3D direction={endPoint} color={PrimeColor.yellow} length={endPoint.length()} />
    <Latex3D
      position={endPoint.clone().add(new Vector3(0.4, 0, 0))}
      latex={`\\mathbf{v}`}
      offset={-2}
      color={PrimeColor.yellow}
    />
  </Vector3D>

  <!-- Vector u -->
  <Vector3D
    direction={u}
    color={PrimeColor.blue}
    origin={v_0}
    length={u.length()}
    striped
    radius={0.07}
  />
  <Latex3D
    position={v_0.clone().add(u)}
    latex={'\\mathbf{u}'}
    offset={0.4}
    color={PrimeColor.blue}
  />

  <!-- Line l -->
  <Vector3D
    origin={u.clone().multiplyScalar(-2).add(v_0)}
    direction={u}
    radius={0.03}
    length={15}
    hideHead
    color={PrimeColor.blue}
  />

  <Axis3D axisLength={6} />
</Canvas3D>
