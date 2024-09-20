<script>
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const v_0 = new Vector3(-2, 3, 2);
  const u = new Vector3(2, 1, -1);

  let controls = Controls.addSlider(2, -1.5, 3, 0.1, PrimeColor.darkGreen);

  const ru_len = $derived(controls[0] * u.length());
  const formula = $derived(new Formula('r = \\$', controls[0], PrimeColor.darkGreen));
</script>

<Canvas3D
  formulas={[formula]}
  cameraPosition={new Vector3(3.31, 6.55, 15.68)}
  cameraZoom={38}
  {controls}
  title="A parametric vector of a line in 3D space"
>
  <!-- Vector v_0 -->
  <Vector3D direction={v_0} color={PrimeColor.raspberry} length={v_0.length()} />
  <Latex3D position={v_0} latex={'\\mathbf{v}_0'} extend={0.6} color={PrimeColor.raspberry} />

  <!-- Vector r * u -->
  <Vector3D direction={u} color={PrimeColor.darkGreen} origin={v_0} length={ru_len}>
    {#snippet children(endPoint)}
      <Latex3D
        position={endPoint}
        latex={`\\space r\\mathbf{u}`}
        extend={0.5}
        color={PrimeColor.darkGreen}
      />

      <!-- Vector v -->
      <Vector3D direction={endPoint} color={PrimeColor.yellow} length={endPoint?.length()} />
      <Latex3D
        position={endPoint?.clone().add(new Vector3(0.4, 0, 0))}
        latex={`\\mathbf{v}`}
        extend={-2}
        color={PrimeColor.yellow}
      />
    {/snippet}
  </Vector3D>

  <!-- Vector u -->
  <Vector3D
    direction={u}
    color={PrimeColor.blue}
    origin={v_0}
    length={u.length()}
    isDashed
    radius={1.1}
    alwaysOnTop
  />
  <Latex3D
    position={v_0.clone().add(u)}
    latex={'\\mathbf{u}'}
    extend={0.4}
    color={PrimeColor.blue}
  />

  <!-- Line l -->
  <Vector3D
    origin={u.clone().multiplyScalar(-2).add(v_0)}
    direction={u}
    radius={0.3}
    length={15}
    hideHead
    color={PrimeColor.blue}
  />

  <Axis3D axisLength={6} />
</Canvas3D>
