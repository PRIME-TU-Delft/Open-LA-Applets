<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
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
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  cameraPosition = new Vector2(3, 1);
  cameraZoom = 1.5;

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
  xAxisLabel = '\\operatorname{Re}';
  yAxisLabel = '\\operatorname{Im}';

  function SnapToGrid(position: Vector2): Vector2 {
    const snappedX = Number(position.x.toFixed(1));
    const snappedY = Number(position.y.toFixed(1));
    return new Vector2(snappedX, snappedY);
  }
  const draggablePoint = [
    new Draggable(new Vector2(1, 2), PrimeColor.green, undefined, SnapToGrid)
  ];
  const formulas = $derived.by(() => {
    const Re = draggablePoint[0].position.x;
    let str = '';
    if (Re !== 0) {
      str += '\\$1';
    }
    const Im = draggablePoint[0].position.y;
    if (Im > 0) {
      if (Re !== 0) {
        str += '+';
      }
      if (Im !== 1) {
        str += '\\$2i';
      } else {
        str += 'i';
      }
    }
    if (Im < 0) {
      if (Im !== -1) {
        str += '\\$2i';
      } else {
        str += 'i';
      }
    }
    return [
      new Formula(str)
        .addAutoParam(draggablePoint[0].position.x.toFixed(1).replace('.0', ''), PrimeColor.orange)
        .addAutoParam(draggablePoint[0].position.y.toFixed(1).replace('.0', ''), PrimeColor.blue)
    ];
  });
</script>

<Canvas2D
  draggables={draggablePoint}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <Latex2D
    latex={formulas[0].latex}
    position={draggablePoint[0].position}
    color={PrimeColor.black}
    alignX={draggablePoint[0].position.x < 0 ? 'right' : 'left'}
    alignY={draggablePoint[0].position.y < 0 ? 'top' : 'bottom'}
    offset={new Vector2(
      draggablePoint[0].position.x < 0 ? -0.1 : 0.1,
      draggablePoint[0].position.y < 0 ? -0.1 : 0.1
    )}
    background={PrimeColor.green + PrimeColor.opacity(0.4)}
    padding="1em"
  />
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(draggablePoint[0].position.x, 0)}
    color={PrimeColor.orange}
    isDashed={true}
    width={0.05}
  />
  <Point2D
    position={new Vector2(draggablePoint[0].position.x, 0)}
    color={PrimeColor.orange}
    radius={0.08}
  />
  <Latex2D
    latex={draggablePoint[0].position.x.toFixed(1).replace('.0', '')}
    color={PrimeColor.orange}
    position={new Vector2(draggablePoint[0].position.x, 0)}
    alignX="center"
    alignY={draggablePoint[0].position.y < 0 ? 'bottom' : 'top'}
    offset={new Vector2(
      draggablePoint[0].position.x < 0 ? -0.15 : 0,
      draggablePoint[0].position.y < 0 ? 0.15 : -0.15
    )}
    background={PrimeColor.white + PrimeColor.opacity(0.9)}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(0, draggablePoint[0].position.y)}
    color={PrimeColor.blue}
    isDashed={true}
    width={0.05}
  />
  <Point2D
    position={new Vector2(0, draggablePoint[0].position.y)}
    color={PrimeColor.blue}
    radius={0.08}
  />
  <Latex2D
    latex={draggablePoint[0].position.y.toFixed(1).replace('.0', '')}
    color={PrimeColor.blue}
    position={new Vector2(0, draggablePoint[0].position.y)}
    alignX={draggablePoint[0].position.x < 0 ? 'left' : 'right'}
    alignY="center"
    offset={new Vector2(draggablePoint[0].position.x < 0 ? 0.15 : -0.15, 0)}
    background={PrimeColor.white + PrimeColor.opacity(0.9)}
  />
</Canvas2D>
