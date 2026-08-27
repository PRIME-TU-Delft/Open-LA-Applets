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
  cameraPosition = new Vector2(2, 0);
  cameraZoom = 2.5;

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
  function fresnelS(x: number): number {
    if (x === 0) return 0;

    const ax = Math.abs(x);

    // Abramowitz & Stegun rational approximations for auxiliary functions f(x) and g(x)
    const f = (1.0 + 0.926 * ax) / (2.0 + 1.792 * ax + 3.104 * ax * ax);
    const g = 1.0 / (2.0 + 4.142 * ax + 3.492 * ax * ax + 6.67 * ax * ax * ax);

    const angle = (Math.PI * ax * ax) / 2.0;
    const result = 0.5 - f * Math.cos(angle) - g * Math.sin(angle);

    // S(x) is an odd function: S(-x) = -S(x)
    return x >= 0 ? result : -result;
  }
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
  const Integrand = (x: number) => Math.cos((1 / 2) * Math.PI * x ** 2);
  const Integral = (x: number) => Math.sqrt(Math.PI / 2) * fresnelC(x); // Integral of Integrand from 0 to x
  const IntegrandS = (x: number) => Math.sin((1 / 2) * Math.PI * x ** 2);
  const IntegralS = (x: number) => Math.sqrt(Math.PI / 2) * fresnelS(x); // Integral of IntegrandS from 0 to x
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Integrand, PrimeColor.raspberry, {
      legendText: "C'(x)",
      domain: { xMin: 0 },
      width: 0.05,
      integral: {
        xLeft: 0,
        xRight: 0,
        legendText: 'C(x)',
        color: PrimeColor.darkGreen
      }
    }),
    new FunctionFragment(IntegrandS, PrimeColor.yellow, {
      legendText: "S'(x)",
      domain: { xMin: 0 },
      width: 0.05,
      shape: 'diamond',
      integral: {
        xLeft: 0,
        xRight: 0,
        legendText: 'S(x)',
        color: PrimeColor.blue
      }
    })
  ];
  function Snap(position: Vector2): Vector2 {
    const x = Math.max(0, Number(position.x.toFixed(2))); // in increments of 0.01;
    return new Vector2(x, 0);
  }
  const initX = 0.75;
  const draggablePoint = [
    new Draggable(
      new Vector2(initX, 0),
      PrimeColor.orange,
      undefined,
      Snap,
      undefined,
      undefined,
      0.12
    )
  ];
  const N = 1;
</script>

<CanvasGrid
  rows={2}
  columns={2 * N}
  legendItems={[...getLegend(appletObjects)]}
  legendFormulaPosition="center"
>
  <GridCanvas2D
    draggables={[draggablePoint[0]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    gridRow="1"
    gridColumn={'1 / span ' + N}
  >
    <ExplicitFunction2D
      func={Integrand}
      xMin={0}
      color={PrimeColor.raspberry}
      width={0.05}
      integral={{
        xLeft: 0,
        xRight: draggablePoint[0].position.x,
        fillStyle: 'full',
        color: PrimeColor.darkGreen
      }}
      curvatureThreshold={0.001}
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
    draggables={[draggablePoint[0]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: 'x', yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    gridRow="1"
    gridColumn={N + 1 + ' / span ' + N}
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

  <GridCanvas2D
    draggables={[draggablePoint[0]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    gridRow="2"
    gridColumn={'1 / span ' + N}
  >
    <ExplicitFunction2D
      func={IntegrandS}
      xMin={0}
      color={PrimeColor.yellow}
      width={0.05}
      integral={{
        xLeft: 0,
        xRight: draggablePoint[0].position.x,
        color: PrimeColor.blue,
        fillStyle: 'full'
      }}
      curvatureThreshold={0.001}
    />
    <Point2D
      position={new Vector2(draggablePoint[0].position.x, IntegrandS(draggablePoint[0].position.x))}
      color={PrimeColor.pink}
      shape="diamond"
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
    draggables={[draggablePoint[0]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: 'x', yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    gridRow="2"
    gridColumn={N + 1 + ' / span ' + N}
  >
    <ExplicitFunction2D func={IntegralS} xMin={0} color={PrimeColor.blue} width={0.06} />
    <Latex2D
      latex={toLatexText(`$x$`)}
      color={PrimeColor.orange}
      position={new Vector2(draggablePoint[0].position.x, -0.3)}
      alignX="center"
      alignY="top"
    />
    <ExplicitFunction2D
      func={(x: number) =>
        IntegralS(draggablePoint[0].position.x) +
        IntegrandS(draggablePoint[0].position.x) * (x - draggablePoint[0].position.x)}
      color={PrimeColor.raspberry}
      width={0.06}
      xMin={draggablePoint[0].position.x - 0.5}
      xMax={draggablePoint[0].position.x + 0.5}
    />
    <Point2D
      position={new Vector2(draggablePoint[0].position.x, IntegralS(draggablePoint[0].position.x))}
      color={PrimeColor.pink}
      shape="diamond"
    />
  </GridCanvas2D>
</CanvasGrid>
