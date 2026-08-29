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
  import { projectToParametrizedFunction2D } from '$lib/utils/MathLib';

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
  const a = 3;
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
  const c = Math.sqrt(Math.abs(a ** 2 + b ** 2));
  const FocalPoint1 = new Vector2(x0 - c, y0);
  const FocalPoint2 = new Vector2(x0 + c, y0);
  function Hyperbola(x: number, y: number): number {
    return (x - x0) ** 2 / a ** 2 - (y - y0) ** 2 / b ** 2 - 1;
  }
  function HyperbolaXRight(t: number): number {
    return x0 + a * Math.cosh(t);
  }
  function HyperbolaXLeft(t: number): number {
    return x0 - a * Math.cosh(t);
  }
  function HyperbolaY(t: number): number {
    return y0 + b * Math.sinh(t);
  }
  const appletObjects: AppletObject[] = [
    new ImplicitFunctionFragment(Hyperbola, PrimeColor.blue, {
      legendText: '\\frac{x^2}{9}-\\frac{y^2}{16} = 1',
      width: 0.15,
      maxDepth: 2,
      stepSize: 0.08
    }),
    new Point(FocalPoint1, PrimeColor.darkGreen, { radius: 0.3, shape: 'square' }),
    new Point(FocalPoint2, PrimeColor.orange, { radius: 0.3, shape: 'triangle' })
  ];
  const tInit = 0.33 * Math.PI;
  const xInit = HyperbolaXRight(tInit);
  const yInit = HyperbolaY(tInit);
  const draggables = [
    new Draggable(
      new Vector2(xInit, yInit),
      PrimeColor.pink,
      undefined,
      SnapToHyperbola,
      undefined,
      undefined,
      0.3,
      'diamond'
    )
  ];
  function SnapToHyperbola(position: Vector2): Vector2 {
    const x = position.x;
    const y = position.y;
    let projected: Vector2 | undefined;
    if (x > 0 && y > 0) {
      projected = projectToParametrizedFunction2D(HyperbolaXRight, HyperbolaY, position, 0, 10)[0];
    } else if (x > 0 && y < 0) {
      projected = projectToParametrizedFunction2D(HyperbolaXRight, HyperbolaY, position, -10, 0)[0];
    } else if (y > 0) {
      projected = projectToParametrizedFunction2D(HyperbolaXLeft, HyperbolaY, position, 0, 10)[0];
    } else {
      projected = projectToParametrizedFunction2D(HyperbolaXLeft, HyperbolaY, position, -10, 0)[0];
    }
    return projected;
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
  <Circle2D
    position={draggables[0].position}
    radius={Math.abs(Length1 - Length2)}
    color={PrimeColor.pink}
    isDashed={true}
    width={0.08}
    fill={PrimeColor.pink + PrimeColor.opacity(0.1)}
  />
  <Line2D
    start={FocalPoint1}
    end={draggables[0].position}
    color={PrimeColor.darkGreen}
    width={0.12}
  />
  <Line2D start={FocalPoint2} end={draggables[0].position} color={PrimeColor.orange} width={0.12} />
  {#if Length1 > Length2}
    <Circle2D
      position={FocalPoint1}
      radius={Length1}
      color={PrimeColor.darkGreen}
      isDashed={true}
      width={0.08}
    />
    <Line2D
      start={FocalPoint1}
      end={FocalPoint1.clone().add(Segment2)}
      color={PrimeColor.orange}
      width={0.12}
    />
    <Circle2D
      position={FocalPoint1}
      radius={Length2}
      color={PrimeColor.orange}
      isDashed={true}
      width={0.08}
    />
  {:else}
    <Circle2D
      position={FocalPoint2}
      radius={Length2}
      color={PrimeColor.orange}
      isDashed={true}
      width={0.08}
    />
    <Line2D
      start={FocalPoint2}
      end={FocalPoint2.clone().add(Segment1)}
      color={PrimeColor.darkGreen}
      width={0.12}
    />
    <Circle2D
      position={FocalPoint2}
      radius={Length1}
      color={PrimeColor.darkGreen}
      isDashed={true}
      width={0.08}
    />
  {/if}
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
