<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Trajectory2D from '$lib/d3/Trajectory2D.svelte';
  import { confettiState } from '$lib/stores/confetti.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const snapDistance = 0.05;

  function snapToStaightLine(v: Vector2) {
    if (Math.abs(v.x / v.y + 2) < snapDistance) {
      return new Vector2(v.x, v.x / -2);
    } else if (Math.abs(v.x / v.y - 2) < snapDistance) {
      return new Vector2(v.x, v.x / 2);
    }

    return v;
  }

  function releaseFn(v: Vector2) {
    if (v.x / v.y == -2 || v.x / v.y == 2) {
      confettiState.center(1000);
    }

    return v;
  }

  const draggables = [
    new Draggable(
      new Vector2(3, 5),
      PrimeColor.raspberry,
      '\\mathbf{v_1}',
      snapToStaightLine,
      releaseFn
    )
  ];

  const formulas = $derived.by(() => {
    const f1 = new Formula('\\text{Wat moet hier komen Christophe?}');
    const f2 = new Formula('A = \\begin{bmatrix} 1 & 4 \\\\ 1 & 1 \\end{bmatrix} ');
    const f3 = new Formula('\\mathbf{v_1} = \\begin{bmatrix} \\$1 \\\\ \\$2 \\end{bmatrix} ')
      .addAutoParam(round(draggables[0].position.x), PrimeColor.raspberry)
      .addAutoParam(round(draggables[0].position.y), PrimeColor.raspberry);

    return [f1, f2, f3];
  });
</script>

<Canvas2D {draggables} {formulas} cameraZoom={0.5}>
  <Trajectory2D start={new Vector2(-30, 15.05)} color={PrimeColor.yellow} width={0.05} />
  <Trajectory2D
    start={new Vector2(-30, 14.999)}
    color={PrimeColor.yellow}
    width={0.05}
    stepSize={0.3}
  />

  <Trajectory2D start={draggables[0].position} color={PrimeColor.raspberry} width={0.05} />
</Canvas2D>
