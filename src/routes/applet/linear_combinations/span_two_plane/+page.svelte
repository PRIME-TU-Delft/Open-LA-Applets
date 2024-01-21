<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Vector3D, PlaneFromPoints } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Sliders } from '$lib/utils/Slider';

  const u = new Vector3(1, 2, -2); // Vector u
  const v = new Vector3(3, 1, 0); // Vector v

  const labelPosition = u.clone().add(v).normalize().multiplyScalar(8); // only used for label -> Span{u,v}

  let sliders = new Sliders().addSlider(1, -2, 2, 0.2).addSlider(1, -2, 2, 0.2);

  //Slider y is red so it is the scalar of the red vector u, the same goes for yellow with slider x and vector v
  $: x1u_plus_x2v = u.clone().multiplyScalar(sliders.y).add(v.clone().multiplyScalar(sliders.x));
</script>

<Canvas3D bind:sliders>
  <!-- Vector u -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.yellow} />
  <Latex3D
    latex={'\\mathbf{u}'}
    position={u}
    color={PrimeColor.yellow}
  />

  <!-- Vector v -->
  <Vector3D direction={v} length={v.length()} color={PrimeColor.red} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={v}
    color={PrimeColor.red}
  />

  <!-- Vector x1u + x2v -->
  <Vector3D direction={x1u_plus_x2v} length={x1u_plus_x2v.length()} color={PrimeColor.orange} />
  <Latex3D
    latex={'\\mathbf{x_1u + x_2v}'}
    position={x1u_plus_x2v}
    color={PrimeColor.orange}
  />

  <!-- Plane span -->
  <PlaneFromPoints points={[new Vector3(0, 0, 0), u, v]} color={PrimeColor.blue} size={21} />
  <Latex3D
    latex={'Span\\{\\mathbf{u},\\mathbf{v}\\}'}
    position={labelPosition}
    offset={1.5}
    color={PrimeColor.blue}
  />

  <Axis3D />
</Canvas3D>
