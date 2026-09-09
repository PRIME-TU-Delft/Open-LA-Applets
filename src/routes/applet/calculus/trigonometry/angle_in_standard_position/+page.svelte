<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;

  // ########################
  // TUTORIAL / DOCUMENTATION
  // ########################
  // https://docs.openla.ewi.tudelft.nl/?path=/docs/tutorials-tutorial-template--docs
  // on this page you can find documentation for the template objects and a tutorial on using them

  // ###############
  // CAMERA SETTINGS
  // ###############

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-3, -4), // bottom-left
    new Vector2(4, 7), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 0,
    skipY: 0
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 1;
  let scaleY = 1;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  function SnapToGrid(position: Vector2): Vector2 {
    const re = position.x;
    const im = position.y;
    const r = Math.sqrt(re * re + im * im);
    const theta = Math.atan2(im, re);
    const snappedR = Number(r.toFixed(1));
    const snappedTheta = Number((theta / Math.PI).toFixed(2)) * Math.PI;
    const snappedX = snappedR * Math.cos(snappedTheta);
    const snappedY = snappedR * Math.sin(snappedTheta);
    return new Vector2(snappedX, snappedY);
  }
  const r = 3;
  const theta = 0.67 * Math.PI;
  const re = r * Math.cos(theta);
  const im = r * Math.sin(theta);
  const draggablePoint = [
    new Draggable(new Vector2(re, im), PrimeColor.green, undefined, SnapToGrid)
  ];
  const formulas = $derived.by(() => {
    const re = draggablePoint[0].position.x;
    const im = draggablePoint[0].position.y;
    const theta = Math.atan2(im, re);
    return new Formulas(
      new Formula(
        '\\theta&=' +
          (theta / Math.PI)
            .toFixed(2)
            .replace('1.00', '')
            .replace(/\.?0+$/, '') +
          '\\pi',
        undefined,
        undefined,
        PrimeColor.orange
      )
    ).align();
  });
</script>

<Canvas2D
  draggables={draggablePoint}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  {formulas}
  showFormulasDefault={true}
>
  {@const re = draggablePoint[0].position.x}
  {@const im = draggablePoint[0].position.y}
  {@const r = Math.sqrt(re * re + im * im)}
  {@const theta = Math.atan2(im, re)}
  <Line2D
    start={new Vector2(0, 0)}
    end={draggablePoint[0].position.clone().multiplyScalar(100)}
    color={PrimeColor.blue}
    width={0.05}
  />
  <Angle2D
    startAngle={0}
    endAngle={theta}
    hasHead={true}
    distance={0.5 * r}
    color={PrimeColor.orange}
    width={0.05}
  />
  <Latex2D
    latex="\theta"
    color={PrimeColor.orange}
    position={new Vector2(0.5 * r * Math.cos(theta / 2), 0.5 * r * Math.sin(theta / 2)).add(
      new Vector2(Math.sin(theta), -Math.cos(theta)).multiplyScalar(theta > 0 ? 0.3 : -0.3)
    )}
    alignX="center"
    alignY="center"
  />
</Canvas2D>
