<script>
  import { Axis3D, Canvas3D, Latex3D, Vector3D } from '$lib/threlte-components';
  import { Vector3 } from 'three';
  import LatexUI from '$lib/components/Latex.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Slider, Sliders } from '$lib/utils/Slider';

  const v_0 = new Vector3(-2, 3, 2);
  const u = new Vector3(2, 1, -1);

  let sliders = new Sliders().add(new Slider(2, -1.5, 3, 0.1, PrimeColor.green));

  $: ru_len = sliders.x * u.length();
</script>

<Canvas3D cameraPosition={new Vector3(3.31, 6.55, 15.68)} zoom={38} bind:sliders>
  <!-- Vector v_0 -->
  <Vector3D direction={v_0} color={PrimeColor.red} length={v_0.length()} />
  <Latex3D position={v_0} latex={'\\mathbf{v}_0'} offset={0.6} color={PrimeColor.red} />

  <!-- Vector r * u -->
  <Vector3D direction={u} color={PrimeColor.green} origin={v_0} length={ru_len} let:endPoint>
    <Latex3D
      position={endPoint}
      latex={`\\space r\\mathbf{u}`}
      offset={0.5}
      color={PrimeColor.green}
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
    color={PrimeColor.ultramarine}
    origin={v_0}
    length={u.length()}
    striped
    radius={0.07}
  />
  <Latex3D
    position={v_0.clone().add(u)}
    latex={'\\mathbf{u}'}
    offset={0.4}
    color={PrimeColor.ultramarine}
  />

  <!-- Line l -->
  <Vector3D
    origin={u.clone().multiplyScalar(-2).add(v_0)}
    direction={u}
    radius={0.03}
    length={15}
    hideHead
    color={PrimeColor.ultramarine}
  />

  <div slot="formulas">
    <LatexUI params={[sliders.x]} colors={[PrimeColor.green]} latex={'r = \\$0'} />
  </div>

  <Axis3D axisLength={6} />
</Canvas3D>
