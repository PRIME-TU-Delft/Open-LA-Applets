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
  cameraPosition = new Vector2(1, 1);
  cameraZoom = 4;

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
  // 2. Pure JS implementation (Abramowitz and Stegun approximation)
  function calculateErf(x: number): number {
    const sign = x >= 0 ? 1 : -1;
    const absX = Math.abs(x);

    // Constants
    const p = 0.3275911;
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;

    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

    return sign * y;
  }
  const Integrand = (x: number) => (2 / Math.sqrt(Math.PI)) * Math.exp(-1 * x ** 2);
  const Integral = (x: number) => calculateErf(x);
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Integrand, PrimeColor.raspberry, {
      legendText: "\\mathrm{erf}'(x)",
      domain: { xMin: 0 },
      width: 0.06,
      integral: {
        xLeft: 0,
        xRight: 0,
        legendText: '\\mathrm{erf}(x)',
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
    {cameraPosition}
    {cameraZoom}
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
    {cameraPosition}
    {cameraZoom}
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
