<script>
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Parallelogram2D from '$lib/d3/Parallelogram2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';

  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const w = new Vector2(1, 1);
  const v = new Vector2(-1, 1);

  const controls = Controls.addSlider(1, -3, 3, 0.5, PrimeColor.cyan);

  const te1 = $derived(new Vector2(1, 0).add(w.clone().multiplyScalar(controls[0])));

  const tv = $derived(v.clone().sub(w.clone().multiplyScalar(controls[0] * 2)));

  const formulas = $derived.by(() => {
    const te1 = new Vector2(1, 0).add(w.clone().multiplyScalar(controls[0]));
    const te2 = new Vector2(0, 1).add(w.clone().multiplyScalar(controls[0]));

    const f1 = new Formula(
      `T(\\mathbf{x}) = \\begin{pmatrix} \\$1 & \\$2 \\\\ \\$3 & \\$4 \\end{pmatrix} \\mathbf{x}`
    )
      .addAutoParam(round(te1.x, 1), PrimeColor.blue)
      .addAutoParam(round(te2.x, 1), PrimeColor.blue)
      .addAutoParam(round(te1.y, 1), PrimeColor.blue)
      .addAutoParam(round(te2.y, 1), PrimeColor.blue);
    return [f1];
  });
</script>

<Canvas2D {controls} {formulas} cameraZoom={2} splitCanvas2DProps={{ cameraZoom: 2 }}>
  <!-- Parallograms -->
  <Parallelogram2D
    points={[new Vector2(0, 0), w, v]}
    color={PrimeColor.darkGreen + PrimeColor.opacity(0.2)}
    strokeWidth={0.2}
  />
  <Parallelogram2D
    points={[new Vector2(0, 0), w, new Vector2(1, 0)]}
    color={PrimeColor.blue + PrimeColor.opacity(0.2)}
    strokeWidth={0.2}
  />

  <!-- e1 & e2 -->
  <Vector2D direction={new Vector2(1, 0)} length={1} color={PrimeColor.blue} />
  <Latex2D
    latex={'\\mathbf{e_1}'}
    extend={0.25}
    offset={new Vector2(0, -0.2)}
    color={PrimeColor.blue}
    position={new Vector2(1, 0)}
  />

  <!-- Line & w -->
  <InfiniteLine2D direction={new Vector2(1, 1)} color={PrimeColor.cyan} />
  <Latex2D latex={'\\mathcal{L}'} color={PrimeColor.cyan} position={new Vector2(2.5, 2.5)} />

  <Vector2D direction={w} length={w.length()} color={PrimeColor.raspberry} />
  <Latex2D
    latex={'\\mathbf{w}'}
    extend={0.25}
    offset={new Vector2(-0.1, -0.25)}
    color={PrimeColor.raspberry}
    position={w}
  />

  <Vector2D direction={v} length={v.length()} color={PrimeColor.darkGreen} />
  <Latex2D
    latex={'\\mathbf{v}'}
    extend={0.1}
    offset={new Vector2(-0.25, 0.1)}
    color={PrimeColor.darkGreen}
    position={v}
  />

  <!-- MARK: split canvas -->
  {#snippet splitCanvas2DChildren()}
    <Parallelogram2D
      points={[new Vector2(0, 0), w, tv]}
      color={PrimeColor.darkGreen + PrimeColor.opacity(0.2)}
      strokeWidth={0.2}
    />
    <Parallelogram2D
      points={[new Vector2(0, 0), w, te1]}
      color={PrimeColor.blue + PrimeColor.opacity(0.2)}
      strokeWidth={0.2}
    />

    <Vector2D direction={te1} length={te1.length()} color={PrimeColor.blue} />
    <Latex2D
      latex={'T(\\mathbf{e_1})'}
      extend={0.25}
      offset={new Vector2(0, -0.2)}
      color={PrimeColor.blue}
      position={te1}
    />

    <InfiniteLine2D direction={new Vector2(1, 1)} color={PrimeColor.cyan} />
    <Latex2D latex={'\\mathcal{L}'} color={PrimeColor.cyan} position={new Vector2(2.5, 2.5)} />

    <Vector2D direction={w} length={w.length()} color={PrimeColor.raspberry} />
    <Latex2D
      latex={'T(\\mathbf{w})'}
      extend={0.25}
      offset={new Vector2(-0.75, 0.25)}
      color={PrimeColor.raspberry}
      position={w}
    />

    <Vector2D direction={tv} length={tv.length()} color={PrimeColor.darkGreen} />
    <Latex2D
      latex={'T(\\mathbf{v})'}
      extend={0.25}
      offset={new Vector2(-0.25, 0.1)}
      color={PrimeColor.darkGreen}
      position={tv}
    />
  {/snippet}
</Canvas2D>
