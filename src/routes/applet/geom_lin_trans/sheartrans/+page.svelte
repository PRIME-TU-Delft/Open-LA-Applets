<script>
  import { Canvas2D, Latex2D, Vector2D } from '$lib/d3-components';
  import InfiniteLine from '$lib/d3-components/InfiniteLine.svelte';
  import Parallelogram from '$lib/d3-components/Parallelogram.svelte';
  import { Controls } from '$lib/utils/Controls';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const w = new Vector2(1, 1);
  const v = new Vector2(-1, 1);

  let controls = Controls.addSlider(0, -3, 3, 0.5, PrimeColor.blue, 'T(e_1)', (v) =>
    v.toFixed(2)
  ).addSlider(0, -3, 3, 0.5, PrimeColor.darkGreen, 'T(v)', (v) => v.toFixed(2));

  $: te1 = new Vector2(1, 0).add(w.clone().multiplyScalar(controls[0]));
  $: tv = v.clone().add(w.clone().multiplyScalar(controls[1]));

  const cameraZoom = 2;
</script>

<Canvas2D bind:controls {cameraZoom} splitCanvas2DProps={{ cameraZoom }}>
  <!-- Parallograms -->
  <Parallelogram
    points={[new Vector2(0, 0), w, v]}
    color={PrimeColor.darkGreen + PrimeColor.opacity(0.2)}
    strokeWidth={0.2}
  />
  <Parallelogram
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

  <Vector2D direction={new Vector2(0, 1)} length={1} color={PrimeColor.blue} isDashed />
  <Latex2D
    latex={'\\mathbf{e_2}'}
    extend={0.25}
    offset={new Vector2(0.1, 0)}
    color={PrimeColor.blue}
    position={new Vector2(0, 1)}
  />

  <!-- Line & w -->
  <InfiniteLine direction={new Vector2(1, 1)} color={PrimeColor.cyan} />
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
  <svelte:fragment slot="splitCanvas">
    <Parallelogram
      points={[new Vector2(0, 0), w, tv]}
      color={PrimeColor.darkGreen + PrimeColor.opacity(0.2)}
      strokeWidth={0.2}
    />
    <Parallelogram
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

    <Vector2D direction={new Vector2(0, 1)} length={1} color={PrimeColor.blue} isDashed />
    <!-- <Latex2D latex={'T(\\mathbf{e_2})'} extend={0.5} color={PrimeColor.blue} position={new Vector2(0,1)} /> -->

    <InfiniteLine direction={new Vector2(1, 1)} color={PrimeColor.cyan} />
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
  </svelte:fragment>
</Canvas2D>
