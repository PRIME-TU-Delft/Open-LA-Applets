<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
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
    new Vector2(-4, -4), // bottom-left
    new Vector2(4, 4), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
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
  xAxisLabel = '';
  yAxisLabel = '';

  // ##############
  // APPLET OBJECTS
  // ##############
  function snapToFuncA(position: Vector2): Vector2 {
    const x = Math.max(0.1, Number(position.x.toFixed(1))); // in increments of 0.1;
    const angle = Math.atan2(draggablePoint[1].position.y, draggablePoint[1].position.x);

    // Keep point B on the same angle while matching the new radius from point A.
    draggablePoint[1].value = new Vector2(x * Math.cos(angle), x * Math.sin(angle));

    return new Vector2(x, 0);
  }
  function snapToFuncB(position: Vector2): Vector2 {
    const radius = draggablePoint[0].position.x;
    const angle = Math.min(
      Math.max(Math.atan2(position.y, position.x), 0.01 * Math.PI),
      0.49 * Math.PI
    );

    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return new Vector2(x, y);
  }
  const A = 3;
  const angle = (3 * Math.PI) / 10;
  const draggablePoint = [
    new Draggable(new Vector2(A, 0), PrimeColor.orange, undefined, snapToFuncA),
    new Draggable(
      new Vector2(A * Math.cos(angle), A * Math.sin(angle)),
      PrimeColor.darkGreen,
      undefined,
      snapToFuncB
    )
  ];
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
  <Circle2D
    position={new Vector2(0, 0)}
    radius={draggablePoint[0].position.x}
    color={PrimeColor.blue}
    width={0.05}
  />
  <Angle2D
    color={PrimeColor.cyan}
    startAngle={0}
    endAngle={Math.atan2(draggablePoint[1].position.y, draggablePoint[1].position.x)}
    distance={draggablePoint[0].position.x / 4}
    width={0.05}
  />
  <Latex2D
    latex="A"
    color={PrimeColor.orange}
    position={new Vector2(draggablePoint[0].position.x + 0.1, draggablePoint[0].position.y - 0.1)}
    alignX="left"
    alignY="top"
  />
  <Latex2D
    latex="B"
    color={PrimeColor.darkGreen}
    position={new Vector2(draggablePoint[1].position.x + 0.1, draggablePoint[1].position.y + 0.1)}
    alignX="left"
    alignY="bottom"
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={draggablePoint[1].position}
    width={0.05}
    color={PrimeColor.black}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={draggablePoint[1].position}
    width={0.05}
    color={PrimeColor.black}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(0, 0)}
    width={0.05}
    color={PrimeColor.black}
  />
  <Line2D
    start={draggablePoint[1].position}
    end={new Vector2(draggablePoint[1].position.x, 0)}
    width={0.05}
    color={PrimeColor.black}
    isDashed={true}
  />
  <Point2D position={new Vector2(draggablePoint[1].position.x, 0)} color={PrimeColor.yellow} />
  <Latex2D
    latex="C"
    color={PrimeColor.yellow}
    position={new Vector2(draggablePoint[1].position.x, -0.1)}
    alignX="center"
    alignY="top"
  />
  <Latex2D
    latex="x"
    color={PrimeColor.cyan}
    position={new Vector2(
      (draggablePoint[0].position.x / 4 + 0.3) *
        Math.cos(Math.atan2(draggablePoint[1].position.y, draggablePoint[1].position.x) / 2),
      (draggablePoint[0].position.x / 4 + 0.3) *
        Math.sin(Math.atan2(draggablePoint[1].position.y, draggablePoint[1].position.x) / 2)
    )}
    alignX="center"
    alignY="center"
  />
</Canvas2D>
