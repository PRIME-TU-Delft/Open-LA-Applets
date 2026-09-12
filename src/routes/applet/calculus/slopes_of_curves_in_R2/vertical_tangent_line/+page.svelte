<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, ParameterizedFunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import { projectToParametrizedFunction2D } from '$lib/utils/MathLib';
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
    new Vector2(-10, -11), // bottom-left
    new Vector2(20, 9), // top-right
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
  let scaleX = 1 / 2;
  let scaleY = 1 / 2;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const tMin = -2;
  const tMax = 2;
  const xEquation = (t: number) => t ** 2 + 2 * t;
  const yEquation = (t: number) => t ** 3;
  const xDerivative = (t: number) => 2 * t + 2;
  const yDerivative = (t: number) => 3 * t ** 2;
  const appletObjects: AppletObject[] = [
    new ParameterizedFunctionFragment(xEquation, yEquation, PrimeColor.blue, {
      legendText: '\\mathcal{C}',
      width: 0.08,
      tStart: tMin,
      tEnd: tMax
    }).addIncludedPoints([
      new Vector2(xEquation(tMin), yEquation(tMin)),
      new Vector2(xEquation(tMax), yEquation(tMax))
    ])
  ];
  const initT = -1;
  const initX = xEquation(initT);
  const initY = yEquation(initT);
  const draggables = [
    new Draggable(
      new Vector2(initX, initY),
      PrimeColor.orange,
      undefined,
      snapCurve,
      undefined,
      undefined,
      0.12
    )
  ];

  function snapCurve(pos: Vector2): Vector2 {
    // We project to the nearest point on the curve, which is defined by the parametric equations.
    const projected = projectToParametrizedFunction2D(xEquation, yEquation, pos, tMin, tMax);
    return projected[0];
  }
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  legendItems={[
    ...getLegend(appletObjects),
    new LegendItem('\\text{Tangent line}', PrimeColor.darkGreen)
  ]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const x = draggables[0].position.x}
  {@const y = draggables[0].position.y}
  <TemplateComponent objects={appletObjects} />
  {@const projected = projectToParametrizedFunction2D(
    xEquation,
    yEquation,
    draggables[0].position,
    tMin,
    tMax
  )}
  {@const t = projected[1]}
  {@const dxdt = xDerivative(t)}
  {@const dydt = yDerivative(t)}
  <InfiniteLine2D
    origin={new Vector2(x, y)}
    direction={new Vector2(dxdt, dydt)}
    color={PrimeColor.darkGreen}
    width={0.08}
  />
</Canvas2D>
