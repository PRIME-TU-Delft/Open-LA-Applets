<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Sliders } from '$lib/utils/Slider';

  const v = new Vector3(3, 2, -3).normalize().multiplyScalar(3); // Vector v;
  const u = v.clone().multiplyScalar(2); // Vector u = 2 * v;
  const lineDir = v.clone().multiplyScalar(6);
  let sliders = new Sliders().addSlider(1, -2, 2, 0.2).addSlider(1, -2, 2, 0.2);

  $: x1u_plus_x2v = v.clone().multiplyScalar(sliders.x).add(u.clone().multiplyScalar(sliders.y))
  $: formulax1 = new Formula('x1 = \\$', sliders.y, PrimeColor.darkGreen);
  $: formulax2 = new Formula('x2 = \\$', sliders.x, PrimeColor.darkGreen);
</script>

<Canvas3D 
  formulas={[formulax1, formulax2]}
  bind:sliders
>
  <Vector3D direction={v} length={v.length()} striped radius={0.08} color={PrimeColor.red} />
  <Latex3D
    latex={'\\mathbf{v}'}
    position={v.clone().add(new Vector3(0, 0.5, 0))}
    color={PrimeColor.red}
  />

  <Vector3D direction={u} length={u.length()} color={PrimeColor.yellow} />
  <Latex3D
    latex={'\\mathbf{u}'}
    position={u.clone().add(new Vector3(0, 0.5, 0))}
    color={PrimeColor.yellow}
  />

  <Vector3D direction={x1u_plus_x2v} length={x1u_plus_x2v.length()} color={PrimeColor.orange} />
  <Latex3D
    latex={'\\mathbf{x_1u + x_2v}'}
    position={x1u_plus_x2v.clone().add(new Vector3(0, 0.5, 0))}
    color={PrimeColor.orange}
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
