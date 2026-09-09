<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    ImplicitFunctionFragment,
    Point
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';

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
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  const x0 = 0;
  const y0 = 0;
  const a = 5;
  const b = 4;
  initialViewBox = new ViewBox(
    new Vector2(x0 - 3 * a, y0 - 3 * b), // bottom-left
    new Vector2(x0 + 3 * a, y0 + 3 * b), // top-right
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
    skipX: 1,
    skipY: 1
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
  const c = Math.sqrt(Math.abs(a ** 2 - b ** 2));
  const FocalPoint1 = a >= b ? new Vector2(x0 + c, y0) : new Vector2(x0, y0 + c);
  const FocalPoint2 = a >= b ? new Vector2(x0 - c, y0) : new Vector2(x0, y0 - c);
  function Ellipse(x: number, y: number): number {
    return (x - x0) ** 2 / a ** 2 + (y - y0) ** 2 / b ** 2 - 1;
  }
  function EllipseX(t: number): number {
    return x0 + a * Math.cos(t);
  }
  function EllipseY(t: number): number {
    return y0 + b * Math.sin(t);
  }
  const appletObjects: AppletObject[] = [
    new ImplicitFunctionFragment(Ellipse, PrimeColor.blue, {
      legendText: '\\frac{x^2}{25}+\\frac{y^2}{16} = 1',
      width: 0.15,
      maxDepth: 2,
      stepSize: 0.08
    }),
    new Point(FocalPoint1, PrimeColor.darkGreen, { radius: 0.3 }),
    new Point(FocalPoint2, PrimeColor.orange, { radius: 0.3 })
  ];
  const tInit = 0.33 * Math.PI;
  const xInit = EllipseX(tInit);
  const yInit = EllipseY(tInit);
  const draggables = [
    new Draggable(
      new Vector2(xInit, yInit),
      PrimeColor.pink,
      undefined,
      SnapToEllipse,
      undefined,
      undefined,
      0.3
    )
  ];
  function SnapToEllipse(position: Vector2): Vector2 {
    let x = position.x;
    let y = position.y;
    let theta = Math.atan2(y - y0, x - x0);
    theta = theta / Math.PI;
    theta = Number(theta.toFixed(2));
    theta = theta * Math.PI;
    x = EllipseX(theta);
    y = EllipseY(theta);
    return new Vector2(x, y);
  }
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const Segment1 = draggables[0].position.clone().sub(FocalPoint1)}
  {@const Segment2 = draggables[0].position.clone().sub(FocalPoint2)}
  {@const Length1 = Segment1.length()}
  {@const Length2 = Segment2.length()}
  {@const Addition1 = Segment1.clone().normalize().multiplyScalar(Length2)}
  {@const Addition2 = Segment2.clone().normalize().multiplyScalar(Length1)}
  <Circle2D
    position={FocalPoint1}
    radius={Length1 + Length2}
    color={PrimeColor.orange}
    isDashed={true}
    width={0.08}
  />
  <Circle2D
    position={FocalPoint2}
    radius={Length1 + Length2}
    color={PrimeColor.darkGreen}
    isDashed={true}
    width={0.08}
  />
  <Line2D
    start={FocalPoint1}
    end={draggables[0].position}
    color={PrimeColor.darkGreen}
    width={0.12}
  />
  <Line2D start={FocalPoint2} end={draggables[0].position} color={PrimeColor.orange} width={0.12} />
  <Line2D
    start={draggables[0].position.clone().add(Addition2)}
    end={draggables[0].position}
    color={PrimeColor.darkGreen}
    width={0.12}
    isDashed={true}
  />
  <Line2D
    start={draggables[0].position.clone().add(Addition1)}
    end={draggables[0].position}
    color={PrimeColor.orange}
    width={0.12}
    isDashed={true}
  />
  <Point2D
    position={draggables[0].position.clone().add(Addition1)}
    color={PrimeColor.orange}
    shape="square"
    radius={0.2}
  />
  <Point2D
    position={draggables[0].position.clone().add(Addition2)}
    color={PrimeColor.darkGreen}
    shape="square"
    radius={0.2}
  />
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
