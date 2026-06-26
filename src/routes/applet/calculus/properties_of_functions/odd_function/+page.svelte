<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';

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
  cameraPosition = new Vector2(0, 1);
  cameraZoom = 1.2;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-3, -4), // bottom-left
    new Vector2(3, 4), // top-right
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
    skipX: -1,
    skipY: -1
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

  // ##############
  // APPLET OBJECTS
  // ##############

  let aStart = Math.sqrt(3) * 2;
  let faStart = 3;

  function SnapToFunction(point: Vector2) {
    const x = point.x > 0 ? Math.max(point.x, 0) : Math.min(point.x, 0);
    const y = (x / 2) * Math.abs(x / 2);
    return new Vector2(x, y);
  }

  const draggablePoint = [
    new Draggable(new Vector2(aStart, faStart), PrimeColor.raspberry, undefined, SnapToFunction)
  ];

  const appletObjects: AppletObject[] = [new FunctionFragment('(x/2)*|x/2|', PrimeColor.blue)];
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
  <TemplateComponent objects={appletObjects} />
  <Latex2D
    latex="a"
    position={new Vector2(draggablePoint[0].position.x, 0)}
    color={PrimeColor.raspberry}
    alignX="center"
    alignY={draggablePoint[0].position.x > 0 ? 'top' : 'bottom'}
  />
  <Latex2D
    latex="-a"
    position={new Vector2(-draggablePoint[0].position.x, 0)}
    color={PrimeColor.orange}
    alignX="center"
    alignY={draggablePoint[0].position.x < 0 ? 'top' : 'bottom'}
  />
  <Latex2D
    latex="(-a,f(-a))"
    position={new Vector2(
      -draggablePoint[0].position.x + (draggablePoint[0].position.x > 0 ? -0.1 : 0.1),
      -draggablePoint[0].position.y
    )}
    color={PrimeColor.orange}
    alignX={draggablePoint[0].position.x > 0 ? 'right' : 'left'}
    alignY={draggablePoint[0].position.x < 0 ? 'top' : 'bottom'}
  />
  <Latex2D
    latex="(a,f(a))"
    position={new Vector2(
      draggablePoint[0].position.x + (draggablePoint[0].position.x < 0 ? -0.1 : 0.1),
      draggablePoint[0].position.y
    )}
    color={PrimeColor.raspberry}
    alignX={draggablePoint[0].position.x > 0 ? 'left' : 'right'}
    alignY={draggablePoint[0].position.x > 0 ? 'top' : 'bottom'}
  />
  <Point2D
    position={new Vector2(-draggablePoint[0].position.x, -draggablePoint[0].position.y)}
    color={PrimeColor.orange}
  />
  <Line2D
    start={new Vector2(-draggablePoint[0].position.x, 0)}
    end={new Vector2(-draggablePoint[0].position.x, -draggablePoint[0].position.y)}
    color={PrimeColor.orange}
    isDashed={true}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={new Vector2(-draggablePoint[0].position.x, -draggablePoint[0].position.y)}
    color={PrimeColor.orange}
    isDashed={true}
  />
  <Line2D
    start={new Vector2(draggablePoint[0].position.x, 0)}
    end={new Vector2(draggablePoint[0].position.x, draggablePoint[0].position.y)}
    color={PrimeColor.raspberry}
    isDashed={true}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={new Vector2(draggablePoint[0].position.x, draggablePoint[0].position.y)}
    color={PrimeColor.raspberry}
    isDashed={true}
  />
</Canvas2D>
