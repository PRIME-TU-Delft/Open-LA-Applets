<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';

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
  initialViewBox = new ViewBox(
    new Vector2(-1, -2), // bottom-left
    new Vector2(5, 6), // top-right
    0 // margin
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

  // ##############
  // APPLET OBJECTS
  // ##############
  function fresnelC(x: number): number {
    if (x === 0) return 0;

    const ax = Math.abs(x);

    // Abramowitz & Stegun rational approximations for auxiliary functions f(x) and g(x)
    const f = (1.0 + 0.926 * ax) / (2.0 + 1.792 * ax + 3.104 * ax * ax);
    const g = 1.0 / (2.0 + 4.142 * ax + 3.492 * ax * ax + 6.67 * ax * ax * ax);

    const angle = (Math.PI * ax * ax) / 2.0;
    const result = 0.5 + f * Math.sin(angle) - g * Math.cos(angle);

    // C(x) is an odd function: C(-x) = -C(x)
    return x >= 0 ? result : -result;
  }
  const Integrand = (x: number) => Math.cos(x) / (2 * Math.sqrt(x));
  const Integral = (x: number) =>
    Math.sqrt(Math.PI / 2) * fresnelC(Math.sqrt(x) * Math.sqrt(2 / Math.PI)); // Integral of Integrand from 0 to x
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Integrand, PrimeColor.raspberry, {
      legendText: "G'(x)=\\frac{\\cos(x)}{2\\sqrt{x}}",
      domain: { xMin: 0 },
      width: 0.06,
      integral: {
        xLeft: 0,
        xRight: 0,
        legendText: 'G(x)=\\displaystyle\\int_0^{\\sqrt{x}}\\cos(t^2)\\,dt',
        color: PrimeColor.darkGreen
      }
    })
  ];
  function Snap(position: Vector2): Vector2 {
    const x = Math.max(0, Number(position.x.toFixed(2))); // in increments of 0.01;
    draggablePoint[1].value = new Vector2(x, 0);
    return new Vector2(x, 0);
  }
  function Snap2(position: Vector2): Vector2 {
    const x = Math.max(0, Number(position.x.toFixed(2))); // in increments of 0.01;
    draggablePoint[0].value = new Vector2(x, 0);
    return new Vector2(x, 0);
  }
  const initX = 1;
  const draggablePoint = [
    new Draggable(
      new Vector2(initX, 0),
      PrimeColor.orange,
      undefined,
      Snap,
      undefined,
      undefined,
      0.14
    ),
    new Draggable(
      new Vector2(initX, 0),
      PrimeColor.orange,
      undefined,
      Snap2,
      undefined,
      undefined,
      0.14
    )
  ];
</script>

<CanvasGrid
  rows={1}
  columns={2}
  legendItems={[...getLegend(appletObjects)]}
  legendFormulaPosition="top-left"
>
  <GridCanvas2D
    draggables={[draggablePoint[0]]}
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <ExplicitFunction2D
      func={Integrand}
      xMin={0}
      color={PrimeColor.raspberry}
      width={0.06}
      integral={{
        xLeft: 0,
        xRight: draggablePoint[0].position.x,
        fillStyle: 'full',
        color: PrimeColor.darkGreen
      }}
    />
    <Point2D
      position={new Vector2(draggablePoint[0].position.x, Integrand(draggablePoint[0].position.x))}
      color={PrimeColor.purple}
    />
    <Latex2D
      latex={toLatexText(`$x$`)}
      color={PrimeColor.orange}
      position={new Vector2(draggablePoint[0].position.x, -0.3)}
      alignX="center"
      alignY="top"
    />
  </GridCanvas2D>

  <GridCanvas2D
    draggables={[draggablePoint[1]]}
    {initialViewBox}
    labels={{ xLabel: 'x', yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <ExplicitFunction2D func={Integral} xMin={0} color={PrimeColor.darkGreen} width={0.06} />
    <Latex2D
      latex={toLatexText(`$x$`)}
      color={PrimeColor.orange}
      position={new Vector2(draggablePoint[0].position.x, -0.3)}
      alignX="center"
      alignY="top"
    />
    <ExplicitFunction2D
      func={(x: number) =>
        Integral(draggablePoint[0].position.x) +
        Integrand(draggablePoint[0].position.x) * (x - draggablePoint[0].position.x)}
      color={PrimeColor.raspberry}
      width={0.06}
      xMin={draggablePoint[0].position.x - 0.5}
      xMax={draggablePoint[0].position.x + 0.5}
    />
    <Point2D
      position={new Vector2(draggablePoint[0].position.x, Integral(draggablePoint[0].position.x))}
      color={PrimeColor.purple}
    />
  </GridCanvas2D>
</CanvasGrid>
