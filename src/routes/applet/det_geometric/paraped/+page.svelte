<script lang="ts">
  import { Axis3D, Canvas3D, Latex3D, Point3D, Vector3D } from '$lib/threlte-components';
  import Angle from '$lib/threlte-components/Angle.svelte';
  import Parallelogram from '$lib/threlte-components/Parallelogram.svelte';
  import { Controls } from '$lib/utils/Controls';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { BackSide, FrontSide, Vector3 } from 'three';

  let controls = Controls.addSlider(2, 1, 6, 0.25, PrimeColor.blue, '||a||')
    .addSlider(2, 1, 6, 0.25, PrimeColor.cyan, '||b||')
    .addSlider(0.5, 0, 1, 0.1, PrimeColor.darkGreen, 'θ', (v) => (v / Math.PI).toFixed(2))
    .addToggle(true, '\\text{Fill}');

  function getC(theta: number, length: number = 3) {
    let c = new Vector3(0, 1, 0);
    c.applyAxisAngle(new Vector3(1, 1, 0), theta);
    c.setLength(length);
    return c;
  }

  function getFomulas(a: Vector3, b: Vector3, c: Vector3, c2: number) {
    const height = c.y;
    const axb = a.clone().cross(b);

    const f1 = new Formula('h &= ||\\mathbf{c}||\\cdot \\cos(\\$1\\pi) = \\$2')
      .addAutoParam((c2 / Math.PI).toFixed(2), PrimeColor.darkGreen)
      .addAutoParam(height.toFixed(2), PrimeColor.raspberry);
    const f2 = new Formula(
      '\\mathcal{\\$4}&= \\text{area}(OP\\thinspace QR) \\\\ &= ||\\$1 \\times \\$2|| = \\$3'
    )
      .addAutoParam('a', PrimeColor.blue)
      .addAutoParam('b', PrimeColor.cyan)
      .addAutoParam(axb.length().toFixed(2), PrimeColor.orange)
      .addAutoParam('A', PrimeColor.blue);
    const f3 = new Formula(
      '\\mathcal{\\$4} &= \\$5 \\cdot \\mathcal{\\$6} = \\$1 \\cdot \\$2 = \\$3'
    )
      .addAutoParam(height.toFixed(2), PrimeColor.raspberry)
      .addAutoParam(axb.length().toFixed(2), PrimeColor.orange)
      .addAutoParam((height * axb.length()).toFixed(1), PrimeColor.darkGreen)
      .addAutoParam('V', PrimeColor.yellow)
      .addAutoParam('h', PrimeColor.raspberry)
      .addAutoParam('A', PrimeColor.blue);

    return new Formulas(f1, f2, f3).align();
  }

  const o = new Vector3(0, 0, 0);
  $: a = new Vector3(0, 0, 1).setLength(controls[0]);
  $: b = new Vector3(1, 0, 0.25).setLength(controls[1]);
  $: c = getC(controls[2]);
  $: formulas = getFomulas(a, b, c, controls[2]);
</script>

<Canvas3D bind:controls {formulas} cameraPosition={new Vector3(-13.52, 5.17, 9.53)} cameraZoom={50}>
  <Axis3D showNumbers responsiveSpacing={false} />

  <!-- MARK: A -->
  <Vector3D direction={a} length={controls[0]} color={PrimeColor.blue} />
  <Latex3D
    latex={'a'}
    position={new Vector3(0, -0.2, controls[0] * 0.5)}
    color={PrimeColor.blue}
    hasBackground
  />
  <Latex3D latex={'P'} position={a.clone().add(new Vector3(0, -0.25, 0))} />

  <!-- MARK: B -->
  <Vector3D direction={b} length={controls[1]} color={PrimeColor.cyan} />
  <Latex3D
    latex={'b'}
    position={new Vector3(controls[1] * 0.4, 0, 0)}
    color={PrimeColor.cyan}
    hasBackground
  />
  <Latex3D latex={'R'} position={b.clone().add(new Vector3(0, 0.25, 0))} />

  <!-- MARK: C -->
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
  <Latex3D
    latex={'Q'}
    position={a
      .clone()
      .add(b)
      .add(new Vector3(0, -0.25, 0))}
  />

  <!-- MARK: θ -->
  <Angle vs={[new Vector3(0, 1, 0), c]} size={2} />
  <Latex3D
    latex={String.raw`\theta`}
    position={c
      .clone()
      .normalize()
      .add(new Vector3(0, 1, 0))
      .normalize()
      .multiplyScalar(2)}
  />

  <!-- MARK: Planes -->
  <Parallelogram
    points={[o, a, b]}
    color={PrimeColor.blue}
    opacity={0.5}
    strokeWidth={0.5}
    strokeColor={PrimeColor.blue}
  />
  <Parallelogram
    offset={c}
    points={[o, a, b]}
    color={PrimeColor.blue}
    opacity={0.5}
    strokeWidth={0.5}
    strokeColor={PrimeColor.blue}
  />

  {#if controls[3]}
    <Parallelogram
      points={[o, a, c]}
      color={PrimeColor.yellow}
      opacity={0.25}
      strokeWidth={0.5}
      strokeColor={PrimeColor.yellow}
      side={BackSide}
    />
    <Parallelogram
      points={[o, a, c]}
      offset={b}
      color={PrimeColor.yellow}
      opacity={0.25}
      strokeWidth={0.5}
      strokeColor={PrimeColor.yellow}
      side={FrontSide}
    />
    <Parallelogram
      points={[o, b, c]}
      color={PrimeColor.yellow}
      opacity={0.25}
      strokeWidth={0.5}
      strokeColor={PrimeColor.yellow}
      side={FrontSide}
    />
    <Parallelogram
      points={[o, b, c]}
      offset={a}
      color={PrimeColor.yellow}
      opacity={0.25}
      strokeWidth={0.5}
      strokeColor={PrimeColor.yellow}
      side={BackSide}
    />
  {/if}

  <!-- MARK: A x B -->
  <Vector3D
    direction={new Vector3(0, 1, 0)}
    length={a.clone().cross(b).length()}
    color={PrimeColor.orange}
  />
  <Latex3D
    latex={String.raw`a \times b`}
    position={new Vector3(0, 1, 0).multiplyScalar(controls[0] * controls[1] * 0.75)}
    offset={0}
    color={PrimeColor.orange}
    hasBackground
  />

  <!-- MARK: h  -->
  <Vector3D
    origin={new Vector3(-0.25, 0, -0.25)}
    direction={new Vector3(0, 1, 0)}
    length={c.y}
    color={PrimeColor.raspberry}
    hideHead
  />
  <Latex3D
    latex={'h'}
    position={new Vector3(-0.25, c.y / 2, -0.25)}
    offset={0}
    color={PrimeColor.raspberry}
    hasBackground
  />

  <!-- MARK: Helper Vectors -->
  <!-- From c to h -->
  <Vector3D
    origin={c}
    direction={new Vector3(-c.x - 0.25, 0, -c.z - 0.25)}
    length={new Vector3(-c.x - 0.25, 0, -c.z - 0.25).length()}
    color={PrimeColor.black}
    radius={0.025}
    striped
    hideHead
  />

  <!-- Yellow vectors -->
  <Vector3D origin={a} direction={c} length={c.length()} color={PrimeColor.yellow} hideHead />
  <Point3D position={a} color={PrimeColor.yellow} />

  <Vector3D origin={b} direction={c} length={c.length()} color={PrimeColor.yellow} hideHead />
  <Point3D position={b} color={PrimeColor.yellow} />

  <Vector3D
    origin={a.clone().add(b)}
    direction={c}
    length={c.length()}
    color={PrimeColor.yellow}
    hideHead
  />
  <Point3D position={a.clone().add(b)} color={PrimeColor.yellow} />
</Canvas3D>
