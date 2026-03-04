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
    } else if (Math.abs(v.x / v.y - 2) < snapDistance * 3) {
      return new Vector2(v.x, v.x / 2);
    } else if (Math.abs(v.x) < 0.05 && Math.abs(v.y) < 0.05) {
      return new Vector2(0, 0);
    }

    return v;
  }

  function releaseFn(v: Vector2) {
    if (v.x / v.y == -2 || v.x / v.y == 2) {
      confettiState.center();
    }

    return v;
  }

  const draggables = [
    new Draggable(
      new Vector2(3, 5),
      PrimeColor.raspberry,
      '\\mathbf{x_0}',
      snapToStaightLine,
      releaseFn
    )
  ];

  const formulas = $derived.by(() => {
    const f1 = new Formula(
      "\\mathbf{x'}(t) = \\begin{pmatrix} 1 & 4 \\\\ 1 & 1 \\end{pmatrix} \\mathbf{x}(t) "
    );
    const f2 = new Formula('\\mathbf{x_0} = \\begin{pmatrix} \\$1 \\\\ \\$2 \\end{pmatrix} ')
      .addAutoParam(round(draggables[0].position.x, 1), PrimeColor.raspberry)
      .addAutoParam(round(draggables[0].position.y, 1), PrimeColor.raspberry);

    return [f1, f2];
  });
</script>

<Canvas2D {draggables} {formulas} cameraZoom={0.5}>
  <Trajectory2D start={new Vector2(-30, 15.05)} color={PrimeColor.yellow} width={0.05} />
  <Trajectory2D
    start={new Vector2(-30, 14.999)}
    color={PrimeColor.yellow}
    width={0.05}
    stepSize={0.2}
  />
  <Trajectory2D start={new Vector2(30, -15.05)} color={PrimeColor.yellow} width={0.05} />
  <Trajectory2D
    start={new Vector2(30, -14.999)}
    color={PrimeColor.yellow}
    width={0.05}
    stepSize={0.2}
  />

  <Trajectory2D start={draggables[0].position} color={PrimeColor.raspberry} width={0.05} />
</Canvas2D>
