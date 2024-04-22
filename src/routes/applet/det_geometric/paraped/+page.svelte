<script lang="ts">
  import { Axis3D, Canvas3D, Latex3D, Point3D, Vector3D } from '$lib/threlte-components';
  import { Controls } from '$lib/utils/Controls';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import Plane from './Plane.svelte';
  import Angle from '$lib/threlte-components/Angle.svelte';

  let controls = Controls.addSlider(2, 1, 6, 0.25, PrimeColor.blue, '||a||')
    .addSlider(2, 1, 6, 0.25, PrimeColor.cyan, '||b||')
    .addSlider(0.5, 0, 1, 0.1, PrimeColor.darkGreen, 'θ', (v) => (v / Math.PI).toFixed(2));

  function getC(theta: number, length: number = 3) {
    let c = new Vector3(0, 1, 0);
    c.applyAxisAngle(new Vector3(1, 1, 0), theta);
    c.setLength(length);
    return c;
  }

  function getFomulas(c0: number, c1: number, c2: number, height: number) {
    const f1 = new Formula('h &= ||\\mathbf{c}||\\cdot \\cos(\\$1\\pi) = \\$2')
      .addAutoParam((c2 / Math.PI).toFixed(2), PrimeColor.darkGreen)
      .addAutoParam(height.toFixed(2), PrimeColor.raspberry);
    const f2 = new Formula('\\mathcal{A}&= \\text{area}(OABC) \\\\ &= ||\\$1 \\times \\$2|| = \\$3')
      .addAutoParam('a', PrimeColor.blue)
      .addAutoParam('b', PrimeColor.cyan)
      .addAutoParam((c0 * c1).toFixed(2), PrimeColor.blue);
    const f3 = new Formula('\\mathcal{V} &= h \\cdot \\mathcal{A} = \\$1 \\cdot \\$2 = \\$3')
      .addAutoParam(height.toFixed(2), PrimeColor.raspberry)
      .addAutoParam((c0 * c1).toFixed(2), PrimeColor.blue)
      .addAutoParam((height * c0 * c1).toFixed(1), PrimeColor.darkGreen);

    return new Formulas(f1, f2, f3).align();
  }

  $: c = getC(controls[2]);
  $: formulas = getFomulas(controls[0], controls[1], controls[2], c.y);
</script>

<Canvas3D bind:controls {formulas} cameraPosition={new Vector3(-13.52, 5.17, 9.53)} cameraZoom={50}>
  <Axis3D showNumbers responsiveSpacing={false} />

  <!-- A -->
  <Vector3D direction={new Vector3(0, 0, 1)} length={controls[0]} color={PrimeColor.blue} />
  <Latex3D
    latex={'a'}
    position={new Vector3(0, -0.2, controls[0] * 0.5)}
    color={PrimeColor.blue}
    hasBackground
  />
  <Latex3D latex={'A'} position={new Vector3(0, -0.2, controls[0])} />

  <!-- B -->
  <Vector3D direction={new Vector3(1, 0, 0)} length={controls[1]} color={PrimeColor.cyan} />
  <Latex3D
    latex={'b'}
    position={new Vector3(controls[1] * 0.4, 0, 0)}
    color={PrimeColor.cyan}
    hasBackground
  />
  <Latex3D latex={'B'} position={new Vector3(controls[1], -0.2, 0)} />

  <!-- C -->
  <Vector3D direction={c} length={c.length()} color={PrimeColor.darkGreen} />
  <Latex3D
    latex={'c'}
    position={c
      .clone()
      .normalize()
      .multiplyScalar(1.5)
      .add(new Vector3(0, -0.2, 0))}
    hasBackground
    color={PrimeColor.darkGreen}
  />
  <Latex3D latex={'C'} position={new Vector3(controls[1], -0.2, controls[0])} />

  <!-- θ -->
  <Angle vs={[new Vector3(0, 1, 0), c]} size={2} />
  <Latex3D
    latex={'\\theta'}
    position={c
      .clone()
      .normalize()
      .add(new Vector3(0, 1, 0))
      .normalize()
      .multiplyScalar(2)}
  />

  <!-- Planes -->
  <Plane position={[controls[1] / 2, 0, controls[0] / 2]} size={[controls[1], controls[0]]} />
  <Plane
    position={[c.x + controls[1] / 2, c.y, c.z + controls[0] / 2]}
    size={[controls[1], controls[0]]}
  />

  <!-- Helper Vectors -->
  <Vector3D
    origin={new Vector3(0, 0, controls[0])}
    direction={c}
    length={c.length()}
    color={PrimeColor.yellow}
  />
  <Point3D position={new Vector3(0, 0, controls[0])} color={PrimeColor.yellow} />

  <Vector3D
    origin={new Vector3(controls[1], 0, 0)}
    direction={c}
    length={c.length()}
    color={PrimeColor.yellow}
  />
  <Point3D position={new Vector3(controls[1], 0, 0)} color={PrimeColor.yellow} />

  <Vector3D
    origin={new Vector3(controls[1], 0, controls[0])}
    direction={c}
    length={c.length()}
    color={PrimeColor.yellow}
  />
  <Point3D position={new Vector3(controls[1], 0, controls[0])} color={PrimeColor.yellow} />

  <Latex3D
    latex={'\\mathcal{V}'}
    position={new Vector3(controls[1] / 2, c.y / 2 - 0.2, controls[0] / 2)}
  />
</Canvas3D>
