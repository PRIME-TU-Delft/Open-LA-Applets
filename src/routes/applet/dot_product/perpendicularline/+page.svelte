<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  function lenghtAtLeast(v: Vector2, l: number) {
    const length = v.length();

    if (length < l) {
      return v.clone().normalize().multiplyScalar(l);
    } else {
      return v;
    }
  }

  const draggables = [
    new Draggable(new Vector2(1, 2), PrimeColor.blue, '\\mathbf{n}', (v) => lenghtAtLeast(v, 1))
  ];

  const lineL = $derived(new Vector2(draggables[0].position.y, -draggables[0].position.x));
</script>

<Canvas2D {draggables}>
  <!-- N -->
  <Vector2D
    origin={new Vector2(0, 0)}
    direction={draggables[0].position}
    length={draggables[0].position.length()}
    color={PrimeColor.blue}
  />

  <!-- Line L -->
  <InfiniteLine2D direction={lineL} color={PrimeColor.cyan} />
  <Latex2D
    position={lineL.clone().normalize().multiplyScalar(1.5)}
    latex={'\\mathcal{L}'}
    offset={new Vector2(0, -0.2)}
    color={PrimeColor.cyan}
  />

  <!-- Perpendicular -->
  <RightAngle2D vs={[draggables[0].position, lineL]} />
</Canvas2D>
