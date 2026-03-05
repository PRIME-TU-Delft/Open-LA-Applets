<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Parallelepiped3D from '$lib/threlte/Parallelepiped3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { BackSide, FrontSide } from 'three';
  import { _ } from 'svelte-i18n';

  let controls = Controls.addSlider(2, 1, 6, 0.25, PrimeColor.blue, { label: '||a||' })
    .addSlider(2, 1, 6, 0.25, PrimeColor.cyan, { label: '||b||' })
    .addSlider(0.5, 0, 1, 0.1, PrimeColor.darkGreen, {
      label: 'θ',
      valueFn: (v) => (v / Math.PI).toFixed(2)
    })
    .addToggle(true, '\\text{' + $_('applets.common.fill') + '}');

  const formulas = $derived.by(() => {
    const height = c.y;
    const axb = a.clone().cross(b);

    const f1 = new Formula('h &= ||\\mathbf{c}||\\cdot \\cos(\\$1\\pi) = \\$2')
      .addAutoParam((controls[2] / Math.PI).toFixed(2), PrimeColor.darkGreen)
      .addAutoParam(height.toFixed(2), PrimeColor.raspberry);
    const f2 = new Formula(
      '\\mathcal{\\$4}&= \\text{\\$5}(OP\\thinspace QR) \\\\ &= ||\\$1 \\times \\$2|| = \\$3'
    )
      .addAutoParam('\\mathbf{a}', PrimeColor.blue)
      .addAutoParam('\\mathbf{b}', PrimeColor.cyan)
      .addAutoParam(axb.length().toFixed(2), PrimeColor.orange)
      .addAutoParam('A', PrimeColor.blue)
      .addAutoParam($_('applets.common.area'));
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
  });

  const o = new MathVector3(0, 0, 0);
  const a = $derived(new MathVector3(1, 0, 0).setLength(controls[0]));
  const b = $derived(new MathVector3(0.25, 1, 0).setLength(controls[1]));
  const c = $derived.by(() => {
    let res = new MathVector3(0, 0, 1);
    res.applyAxisAngle(new MathVector3(0, 1, 1), controls[2]);
    res.setLength(3);
    return res;
  });
</script>

<Canvas3D
  {controls}
  {formulas}
  cameraPosition={new MathVector3(9.53, -13.52, 5.17)}
  cameraZoom={50}
>
  <Axis3D showNumbers />

  <!-- MARK: A -->
  <Vector3D direction={a} length={controls[0]} color={PrimeColor.blue} alwaysOnTop />
  <Latex3D
    latex="a"
    position={new MathVector3(controls[0] * 0.5, 0, -0.2)}
    color={PrimeColor.blue}
    hasBackground
  />
  <Latex3D latex="P" position={a.clone().add(new MathVector3(0, 0, -0.25))} />

  <!-- MARK: B -->
  <Vector3D direction={b} length={controls[1]} color={PrimeColor.cyan} alwaysOnTop />
  <Latex3D
    latex="b"
    position={new MathVector3(0, controls[1] * 0.4, 0)}
    color={PrimeColor.cyan}
    hasBackground
  />
  <Latex3D latex="R" position={b.clone().add(new MathVector3(0, 0, 0.25))} />

  <!-- MARK: C -->
  <Vector3D direction={c} length={c.length()} color={PrimeColor.darkGreen} />
  <Latex3D
    latex="c"
    position={c
      .clone()
      .normalize()
      .multiplyScalar(1.5)
      .add(new MathVector3(0, 0, -0.2))}
    hasBackground
    color={PrimeColor.darkGreen}
  />
  <Latex3D
    latex="Q"
    position={a
      .clone()
      .add(b)
      .add(new MathVector3(0, 0, -0.25))}
  />

  <!-- MARK: θ -->
  <Angle3D vs={[new MathVector3(0, 0, 1), c]} size={2} />
  <Latex3D
    latex={String.raw`\theta`}
    position={c
      .clone()
      .normalize()
      .add(new MathVector3(0, 0, 1))
      .normalize()
      .multiplyScalar(2)}
  />

  <!-- MARK: Planes -->
  <Parallelepiped3D
    points={[o, a, b]}
    color={PrimeColor.blue}
    opacity={0.5}
    strokeWidth={0.5}
    strokeColor={PrimeColor.blue}
  />
  <Parallelepiped3D
    offset={c}
    points={[o, a, b]}
    color={PrimeColor.blue}
    opacity={0.5}
    strokeWidth={0.5}
    strokeColor={PrimeColor.blue}
  />

  {#if controls[3]}
    <Parallelepiped3D
      points={[o, a, c]}
      color={PrimeColor.yellow}
      opacity={0.25}
      strokeWidth={0.5}
      strokeColor={PrimeColor.yellow}
      side={BackSide}
    />
    <Parallelepiped3D
      points={[o, a, c]}
      offset={b}
      color={PrimeColor.yellow}
      opacity={0.25}
      strokeWidth={0.5}
      strokeColor={PrimeColor.yellow}
      side={FrontSide}
    />
    <Parallelepiped3D
      points={[o, b, c]}
      color={PrimeColor.yellow}
      opacity={0.25}
      strokeWidth={0.5}
      strokeColor={PrimeColor.yellow}
      side={FrontSide}
    />
    <Parallelepiped3D
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
    direction={new MathVector3(0, 0, 1)}
    length={a.clone().cross(b).length()}
    color={PrimeColor.orange}
  />
  <Latex3D
    latex={String.raw`a \times b`}
    position={new MathVector3(0, 0, 1).multiplyScalar(controls[0] * controls[1] * 0.75)}
    extend={0}
    color={PrimeColor.orange}
    hasBackground
  />

  <!-- MARK: h  -->
  <Vector3D
    origin={new MathVector3(-0.25, -0.25, 0)}
    direction={new MathVector3(0, 0, 1)}
    length={c.y}
    color={PrimeColor.raspberry}
    hideHead
  />
  <Latex3D
    latex="h"
    position={new MathVector3(-0.25, -0.25, c.y / 2)}
    color={PrimeColor.raspberry}
    hasBackground
  />

  <!-- MARK: Helper Vectors -->
  <!-- From c to h -->
  <Vector3D
    origin={c}
    direction={new MathVector3(-c.z - 0.25, -c.x - 0.25, 0)}
    length={new MathVector3(-c.z - 0.25, -c.x - 0.25, 0).length()}
    color={PrimeColor.black}
    radius={0.25}
    isDashed
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
