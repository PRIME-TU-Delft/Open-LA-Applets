<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Vector3D, PlaneFromPoints } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Sliders } from '$lib/utils/Slider';

  const u = new Vector3(1, 2, -2); // Vector u
  const v = new Vector3(3, 1, 0); // Vector v

  const labelPosition = u.clone().add(v).normalize().multiplyScalar(8); // only used for label -> Span{u,v}

  let sliders = new Sliders().addSlider(3, 3, 6, 0.3).addSlider(3, 3, 6, 0.3);
</script>

<Canvas3D bind:sliders>
  <!-- Vector u -->
  <Vector3D direction={u} length={sliders.y} color={PrimeColor.yellow} />
  <Latex3D
    latex={'\\mathbf{u}'}
    position={u.clone().normalize().multiplyScalar(sliders.y)}
    color={PrimeColor.yellow}
  />

  <!-- Vector v -->
  <Vector3D direction={v} length={sliders.x} color={PrimeColor.red} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={v.clone().normalize().multiplyScalar(sliders.x)}
    color={PrimeColor.red}
  />

  <!-- Plane span -->
  <PlaneFromPoints points={[new Vector3(0, 0, 0), u, v]} color={PrimeColor.blue} size={15} />
  <Latex3D
    latex={'Span\\{\\mathbf{u},\\mathbf{v}\\}'}
    position={labelPosition}
    offset={1.5}
    color={PrimeColor.blue}
  />

  <Axis3D />
</Canvas3D>
