<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Polygon2D from '$lib/d3/Polygon2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import {
    snapToAxis,
    snapToCone,
    snapToFirstQuadrant,
    snapToLine,
    snapToMaxDistance,
    values
  } from './draggables';
  import { confettiState, type Side } from '$lib/stores/confetti.svelte';

  const controls = Controls.addSlider(
    1.5,
    -5,
    5,
    0.5,
    PrimeColor.raspberry,
    'c',
    (x) => round(x, 1).toString(),
    validateSlider
  ).addDropdown('', values, PrimeColor.yellow);

  /**
   * Check if conffetti should be shown when the slider is changed
   */
  function validateSlider() {
    if (controls[1] == 'Disc') {
      validateDisk(new Vector2(), 'right');
    } else if (controls[1] == 'First quadrant' && (prod.x < 0 || prod.y < 0)) {
      confettiState.setState('right', 500);
    }
  }

  function validateDisk(v: Vector2, side: Side) {
    const newPoint = snapToMaxDistance(v, 2.5);

    if (side == 'left' && sum.length() > 2.5) {
      confettiState.setState(side, 500);
    } else if (side == 'right' && prod.length() >= 2.5) {
      confettiState.setState(side, 500);
    }

    return newPoint;
  }

  function validateAxis(v: Vector2, side: Side) {
    const newPoint = snapToMaxDistance(v, 2.5);

    if (side == 'left' && sum.x != 0 && sum.y != 0) {
      confettiState.setState(side, 500);
    }

    return newPoint;
  }

  function validateCone(v: Vector2, side: Side = 'left') {
    const newPoint = snapToCone(v);

    if (side == 'right') return newPoint;
    const angle = sum.angle();

    if (
      (angle > 0 && angle < Math.PI / 4) ||
      (angle > Math.PI / 2 && angle < (5 * Math.PI) / 4) ||
      angle > (3 * Math.PI) / 2
    ) {
      confettiState.setState(side, 500);
    }

    return newPoint;
  }

  function getDraggables(type: (typeof values)[number], side: Side = 'left'): Draggable[] {
    switch (type) {
      case 'Affine Line':
        return [
          new Draggable(new Vector2(2, 2), PrimeColor.darkGreen, 'u', (v) =>
            snapToLine(v, new Vector2(1, 1))
          ),
          new Draggable(new Vector2(1, 1), PrimeColor.orange, 'v', (v) =>
            snapToLine(v, new Vector2(1, 1))
          )
        ];
      case 'Disc':
        return [
          new Draggable(
            new Vector2(1, 1),
            PrimeColor.darkGreen,
            'u',
            (v) => snapToMaxDistance(v, 2.5),
            (v) => validateDisk(v, side)
          ),
          new Draggable(
            new Vector2(1, -2),
            PrimeColor.orange,
            'v',
            (v) => snapToMaxDistance(v, 2.5),
            (v) => validateDisk(v, side)
          )
        ];
      case 'Two axes':
        return [
          new Draggable(
            new Vector2(2, 0),
            PrimeColor.darkGreen,
            'u',
            (v) => snapToAxis(v),
            (v) => validateAxis(v, side)
          ),
          new Draggable(
            new Vector2(1, 0),
            PrimeColor.orange,
            'v',
            (v) => snapToAxis(v),
            (v) => validateAxis(v, side)
          )
        ];
      case 'First quadrant':
        return [
          new Draggable(new Vector2(2, 1), PrimeColor.darkGreen, 'u', (v) =>
            snapToFirstQuadrant(v)
          ),
          new Draggable(new Vector2(1, 2), PrimeColor.orange, 'v', (v) => snapToFirstQuadrant(v))
        ];
      case 'Two-sided cone':
        return [
          new Draggable(
            new Vector2(1, 3),
            PrimeColor.darkGreen,
            'u',
            (v) => snapToCone(v),
            (v) => validateCone(v, side)
          ),
          new Draggable(
            new Vector2(1, 1),
            PrimeColor.orange,
            'v',
            (v) => snapToCone(v),
            (v) => validateCone(v)
          )
        ];
    }
    return [];
  }

  function getSplitDraggables(type: (typeof values)[number]) {
    return [getDraggables(type, 'right')[0].clone()];
  }

  const draggables = $derived(getDraggables(controls[1]));

  const splitDraggables = $derived(getSplitDraggables(controls[1]));

  const sum = $derived(draggables[0].value.clone().add(draggables[1].value));
  const prod = $derived(splitDraggables[0].value.clone().multiplyScalar(controls[0]));
</script>

<Canvas2D {controls} {draggables} splitCanvas2DProps={{ draggables: splitDraggables }}>
  {@render subspace()}

  <Point2D position={sum} color={PrimeColor.cyan} />
  <Vector2D
    direction={sum}
    length={sum.length()}
    color={PrimeColor.cyan + PrimeColor.opacity(0.7)}
  />
  <Latex2D position={sum} color={PrimeColor.cyan} latex={`\\mathbf{u} + \\mathbf{v}`} />

  <Vector2D
    direction={draggables[0].value}
    length={draggables[0].value.length()}
    color={PrimeColor.darkGreen + PrimeColor.opacity(0.7)}
  />
  <Latex2D position={draggables[0].value} color={PrimeColor.darkGreen} latex={`\\mathbf{u}`} />
  <Vector2D
    direction={draggables[1].value}
    length={draggables[1].value.length()}
    color={PrimeColor.orange + PrimeColor.opacity(0.7)}
  />
  <Latex2D position={draggables[1].value} color={PrimeColor.orange} latex={`\\mathbf{v}`} />

  {#snippet splitCanvas2DChildren()}
    {@render subspace()}

    <Point2D position={prod} color={PrimeColor.cyan} />
    <Vector2D direction={prod} length={prod.length()} color={PrimeColor.cyan} />
    <Latex2D
      position={prod}
      latex={`\\textcolor{${PrimeColor.raspberry}}{c} \\textcolor{${PrimeColor.darkGreen}}{\\thinspace \\mathbf{u}}`}
    />

    <Vector2D
      direction={splitDraggables[0].value}
      length={splitDraggables[0].value.length()}
      color={PrimeColor.darkGreen}
    />
    <Latex2D
      position={splitDraggables[0].value}
      color={PrimeColor.darkGreen}
      latex={`\\mathbf{u}`}
    />
  {/snippet}
</Canvas2D>

{#snippet subspace()}
  {#if controls[1] == 'Affine Line'}
    <InfiniteLine2D direction={new Vector2(1, 1)} color={PrimeColor.yellow} />
    <Latex2D position={new Vector2(-1, -1)} color={PrimeColor.yellow} latex={`\\mathcal{L}`} />
  {:else if controls[1] == 'Disc'}
    <circle cx={0} cy={0} r={2.5} fill={PrimeColor.yellow} opacity="0.2" />
    <Latex2D position={new Vector2(-1, -1)} color={PrimeColor.yellow} latex={`\\mathcal{A}`} />
  {:else if controls[1] == 'Two axes'}
    <InfiniteLine2D direction={new Vector2(1, 0)} color={PrimeColor.yellow} />
    <InfiniteLine2D direction={new Vector2(0, 1)} color={PrimeColor.yellow} />
    <Latex2D position={new Vector2(-1, -1)} color={PrimeColor.yellow} latex={`\\mathcal{L}`} />
  {:else if controls[1] == 'First quadrant'}
    <rect x={0} y={0} width={30} height={30} fill={PrimeColor.yellow} opacity="0.2" />
    <Latex2D position={new Vector2(4, 0.5)} color={PrimeColor.yellow} latex={`\\mathcal{A}`} />
  {:else if controls[1] == 'Two-sided cone'}
    <Polygon2D
      points={[
        new Vector2(0, 0),
        new Vector2(0, 30),
        new Vector2(30, 30),
        new Vector2(-30, -30),
        new Vector2(0, -30)
      ]}
      color={PrimeColor.yellow + PrimeColor.opacity(0.2)}
    />
    <Latex2D position={new Vector2(0.5, -1)} color={PrimeColor.yellow} latex={`\\mathcal{A}`} />
  {/if}
{/snippet}
