<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, ParameterizedFunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { projectToParametrizedFunction2D } from '$lib/utils/MathLib';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';

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
    new Vector2(-4, -1), // bottom-left
    new Vector2(4, 6), // top-right
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
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  function ParamX1(t: number): number {
    return (1 - t) * -2 + t * 1;
  }
  function ParamY1(t: number): number {
    return (1 - t) * 3 + t * 1;
  }
  function ParamX2(t: number): number {
    const a = 0;
    const b = -1;
    const c = 2;
    const d = 1;
    return a * (t - 1) ** 3 + b * (t - 1) ** 2 + c * (t - 1) + d;
  }
  function ParamY2(t: number): number {
    const q = 1;
    const a = -1 / 2 - (1 / 4) * q;
    const b = 5 / 4 + (5 / 4) * q;
    const c = 1 / 4 - 2 * q;
    const d = q;
    const e = 1;
    return a * (t - 1) ** 4 + b * (t - 1) ** 3 + c * (t - 1) ** 2 + d * (t - 1) + e;
  }
  function ParamX3(t: number): number {
    return (4 - t) * 1 + (t - 3) * -2.5;
  }
  function ParamY3(t: number): number {
    const x = ParamX3(t);
    return (-1 / 9) * (x - 1) ** 2 + 4;
  }
  const appletObjects: AppletObject[] = [
    new ParameterizedFunctionFragment(ParamX1, ParamY1, PrimeColor.blue, {
      tStart: -1 / 6,
      tEnd: 1,
      legendText: '\\mathcal{C}',
      width: 0.08
    }).addIncludedPoints(new Vector2(ParamX1(-1 / 6), ParamY1(-1 / 6))),
    new ParameterizedFunctionFragment(ParamX2, ParamY2, PrimeColor.blue, {
      tStart: 1,
      tEnd: 3,
      width: 0.08
    }).addIncludedPoints(new Vector2(ParamX2(1), ParamY2(1)), undefined, 0.02),
    new ParameterizedFunctionFragment(ParamX3, ParamY3, PrimeColor.blue, {
      tStart: 3,
      tEnd: 4,
      width: 0.08
    }).addIncludedPoints(new Vector2(ParamX3(4), ParamY3(4)))
  ];

  function xEquation(t: number) {
    if (t <= 1) {
      return ParamX1(t);
    } else if (t <= 3) {
      return ParamX2(t);
    } else {
      return ParamX3(t);
    }
  }
  function yEquation(t: number) {
    if (t <= 1) {
      return ParamY1(t);
    } else if (t <= 3) {
      return ParamY2(t);
    } else {
      return ParamY3(t);
    }
  }
  function xDerivative(t: number): number {
    if (t < 0) {
      return -1 * -2 + 1 * 1;
    }
    if (t > 0 && t < 1) {
      return -1 * -2 + 1 * 1;
    }
    if (t > 1 && t <= 3) {
      const a = 0;
      const b = -1;
      const c = 2;
      return 3 * a * (t - 1) ** 2 + 2 * b * (t - 1) + c;
    }
    if (t > 3) {
      return -1 * 1 + 1 * -2.5;
    }
    return 0;
  }
  function yDerivative(t: number) {
    if (t < 0) {
      return -1 * 3 + 1 * 1;
    }
    if (t > 0 && t < 1) {
      return -1 * 3 + 1 * 1;
    }
    if (t > 1 && t <= 3) {
      const q = 1;
      const a = -1 / 2 - (1 / 4) * q;
      const b = 5 / 4 + (5 / 4) * q;
      const c = 1 / 4 - 2 * q;
      const d = q;
      return 4 * a * (t - 1) ** 3 + 3 * b * (t - 1) ** 2 + 2 * c * (t - 1) + d;
    }
    if (t > 3) {
      const x = ParamX3(t);
      return (-2 / 9) * (x - 1) * xDerivative(t);
    }
    return 0;
  }
  function SnapToCurve(pos: Vector2): Vector2 {
    // We project to the nearest point on the curve, which is defined by the parametric equations.
    let projected = projectToParametrizedFunction2D(xEquation, yEquation, pos, -1 / 6, 4);
    // now force that a distance 0.1 is maintained from the t=0 and t=1 and  t=27/7 points, so that the tangent line always exists
    let t = Number(projected[1].toFixed(2));
    if (t === 0) {
      t = 0.01 * Math.sign(projected[1]);
    }
    if (t === 1) {
      t = 0.99 * Math.sign(projected[1]);
    }
    if (Math.abs(t - 27 / 7) < 0.01) {
      t = 27 / 7 + 0.01 * Math.sign(projected[1] - 27 / 7);
    }
    projected = [new Vector2(xEquation(t), yEquation(t)), t];
    return projected[0];
  }
  const initT = 1.5;
  const initX = xEquation(initT);
  const initY = yEquation(initT);
  const draggables = [
    new Draggable(
      new Vector2(initX, initY),
      PrimeColor.raspberry,
      undefined,
      SnapToCurve,
      undefined,
      undefined,
      undefined
    )
  ];
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  legendItems={[
    ...getLegend(appletObjects),
    new LegendItem('\\text{Tangent line}', PrimeColor.yellow)
  ]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  {@const x = draggables[0].position.x}
  {@const y = draggables[0].position.y}
  {@const projected = projectToParametrizedFunction2D(
    xEquation,
    yEquation,
    draggables[0].position,
    -1 / 6,
    4
  )}
  {@const t = projected[1]}
  {#if t !== 0 && t !== 1 && t !== 3 && t !== 27 / 7}
    {@const dxdt = xDerivative(t)}
    {@const dydt = yDerivative(t)}
    <InfiniteLine2D
      origin={new Vector2(x, y)}
      direction={new Vector2(dxdt, dydt)}
      color={PrimeColor.yellow}
      width={0.08}
    />
  {/if}
</Canvas2D>
