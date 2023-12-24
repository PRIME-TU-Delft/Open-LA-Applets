<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Sliders } from '$lib/utils/Slider';

  $: v = new Vector3(3, 2, -3).normalize().multiplyScalar(3); // Vector v;
  $: u = v.clone().multiplyScalar(2); // Vector u = 2 * v;
  $: lineDir = v.clone().normalize().multiplyScalar(10);

  let sliders = new Sliders().addSlider(3, 3, 5.5, 0.3).addSlider(6, 6, 8.5, 0.3);
</script>

<Canvas3D bind:sliders>
  <Vector3D direction={v} length={sliders.x} striped radius={0.08} color={PrimeColor.red} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={v.clone().normalize().multiplyScalar(sliders.x).add(new Vector3(0, 0.5, 0))}
    color={PrimeColor.red}
  />

  <Vector3D direction={u} length={sliders.y} color={PrimeColor.yellow} />
  <Latex3D
    latex={'\\mathbf{u}'}
    position={u.clone().normalize().multiplyScalar(sliders.y).add(new Vector3(0, 0.5, 0))}
    color={PrimeColor.yellow}
  />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.blue} />
  <Latex3D
    latex={'Span\\{\\mathbf{u, v}\\}'}
    position={lineDir}
    offset={0.8}
    color={PrimeColor.blue}
  />
  <Axis3D />
</Canvas3D>
