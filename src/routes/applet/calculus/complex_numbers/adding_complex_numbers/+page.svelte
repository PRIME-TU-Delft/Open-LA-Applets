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
    new Vector2(-1, -2), // bottom-left
    new Vector2(8, 5), // top-right
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
  const Rez = 3;
  const Imz = 1;
  const Rew = 1;
  const Imw = 2;
  const draggablePoint = [
    new Draggable(new Vector2(Rez, Imz), PrimeColor.orange, undefined, SnapToGrid),
    new Draggable(new Vector2(Rew, Imw), PrimeColor.blue, undefined, SnapToGrid)
  ];
  const formulas = $derived.by(() => {
    function getStr(position: Vector2): string {
      const Re = position.x;
      let str = '';
      if (Re !== 0) {
        str += '\\$1';
      }
      const Im = position.y;
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
          str += '-i';
        }
      }
      return str;
    }
    const Sum = draggablePoint[0].position.clone().add(draggablePoint[1].position);
    const f1 = new Formula(
      'z &= ' + getStr(draggablePoint[0].position),
      undefined,
      undefined,
      PrimeColor.orange
    )
      .addAutoParam(draggablePoint[0].position.x.toFixed(1).replace('.0', ''))
      .addAutoParam(draggablePoint[0].position.y.toFixed(1).replace('.0', ''));
    const f2 = new Formula(
      'w &=' + getStr(draggablePoint[1].position),
      undefined,
      undefined,
      PrimeColor.blue
    )
      .addAutoParam(draggablePoint[1].position.x.toFixed(1).replace('.0', ''))
      .addAutoParam(draggablePoint[1].position.y.toFixed(1).replace('.0', ''));
    const f3 = new Formula('z+w &=' + getStr(Sum), undefined, undefined, PrimeColor.green)
      .addAutoParam(Sum.x.toFixed(1).replace('.0', ''))
      .addAutoParam(Sum.y.toFixed(1).replace('.0', ''));
    return new Formulas(f1, f2, f3).align();
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
  {formulas}
  showFormulasDefault={true}
>
  <Latex2D
    latex="z"
    position={draggablePoint[0].position}
    color={PrimeColor.orange}
    alignX="center"
    alignY="bottom"
    background={PrimeColor.white + PrimeColor.opacity(0.9)}
    offset={new Vector2(0, -0.25)}
  />
  <Latex2D
    latex="w"
    position={draggablePoint[1].position}
    color={PrimeColor.blue}
    alignX="center"
    alignY="bottom"
    background={PrimeColor.white + PrimeColor.opacity(0.9)}
    offset={new Vector2(0, 0.25)}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={draggablePoint[0].position}
    color={PrimeColor.orange}
    isDashed={true}
    width={0.05}
  />
  <Line2D
    start={draggablePoint[1].position}
    end={draggablePoint[0].position.clone().add(draggablePoint[1].position)}
    color={PrimeColor.orange}
    isDashed={true}
    width={0.05}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={draggablePoint[1].position}
    color={PrimeColor.blue}
    isDashed={true}
    width={0.05}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={draggablePoint[1].position.clone().add(draggablePoint[0].position)}
    color={PrimeColor.blue}
    isDashed={true}
    width={0.05}
  />
  <Point2D
    position={draggablePoint[1].position.clone().add(draggablePoint[0].position)}
    color={PrimeColor.green}
    radius={0.08}
  />
  <Latex2D
    latex="z+w"
    color={PrimeColor.green}
    position={draggablePoint[1].position.clone().add(draggablePoint[0].position)}
    alignX="left"
    alignY="bottom"
    offset={new Vector2(0.1, 0.1)}
    background={PrimeColor.white + PrimeColor.opacity(0.9)}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={draggablePoint[1].position.clone().add(draggablePoint[0].position)}
    color={PrimeColor.green}
    width={0.05}
  />
</Canvas2D>
