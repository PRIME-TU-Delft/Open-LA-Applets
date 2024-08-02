<script lang="ts">
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { orthogonalProjection } from '$lib/utils/MathLib';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';

  const draggables = [
    new Draggable(new Vector2(1, 0.5), PrimeColor.blue, 'v'),
    new Draggable(new Vector2(2.5, 2.5), PrimeColor.darkGreen, 'w')
  ];

  const v = $derived(draggables[0].value);
  const w = $derived(draggables[1].value);

  const L_label = $derived(v.clone().normalize().multiplyScalar(5).add(new Vector2(-0.3, 0.3)));
  const proj_w = $derived(orthogonalProjection(v, w));

  // nesc for drawing right angle
  const proj_w_min_w = $derived(w.clone().sub(proj_w));
</script>

<Canvas2D {draggables}>
  <!-- L /-->
  <InfiniteLine2D direction={v} color={PrimeColor.cyan} />
  <Latex2D latex={'\\mathcal{L}'} position={L_label} color={PrimeColor.cyan} />

  <!-- projection guide/-->
  <Line2D start={w} end={proj_w} isDashed />

  <!-- w -->
  <Vector2D direction={w} length={w.length()} color={PrimeColor.darkGreen} />
  <Latex2D
    latex={'\\mathbf{w}'}
    offset={w.clone().add(new Vector2(0.1, 0.2))}
    color={PrimeColor.darkGreen}
  />

  <!-- projection of w -->
  <Vector2D direction={proj_w} length={proj_w.length()} color={PrimeColor.raspberry} />
  <Latex2D
    latex={'\\mathbf{\\hat{w}}'}
    offset={proj_w.clone().add(new Vector2(0, -0.2))}
    color={PrimeColor.raspberry}
  />

  <!-- v -->
  <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} />
  <Latex2D
    latex={'\\mathbf{v}'}
    offset={v.clone().add(new Vector2(0, -0.2))}
    color={PrimeColor.blue}
  />

  <!-- right angle -->
  <RightAngle2D size={0.3} vs={[proj_w_min_w, v.clone().multiplyScalar(-1)]} origin={proj_w} />
</Canvas2D>
