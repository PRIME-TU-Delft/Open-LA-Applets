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
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { Draggable } from '$lib/controls/Draggables.svelte';

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
    new Vector2(-2, -2.5), // bottom-left
    new Vector2(3, 2.0), // top-right
    0.25 // margin
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
  let scaleX = 2;
  let scaleY = 2;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  function ParamX(t: number): number {
    return -1 + t;
  }
  function InvParamX(x: number): number {
    return x + 1;
  }
  function ParamY(t: number): number {
    return t ** 2 - 3 * t;
  }
  const appletObjects: AppletObject[] = [
    new ParameterizedFunctionFragment(ParamX, ParamY, PrimeColor.blue, {
      tStart: 0,
      tEnd: 1
    }).addIncludedPoints([new Vector2(ParamX(0), ParamY(0)), new Vector2(ParamX(1), ParamY(1))])
  ];
  function SnapToCurve(position: Vector2): Vector2 {
    const x = position.x;
    let t = InvParamX(x);
    t = Math.min(t, 1);
    t = Math.max(0, t);
    t = Number(t.toFixed(2));
    return new Vector2(ParamX(t), ParamY(t));
  }

  const tInit = 0.5;
  const draggables = [
    // center of taylor polynomial, x0
    new Draggable(
      new Vector2(ParamX(tInit), ParamY(tInit)),
      PrimeColor.orange,
      undefined,
      SnapToCurve,
      undefined,
      undefined,
      undefined
    )
  ];

  const formulas = $derived.by(() => {
    let x = draggables[0].position.x;
    let y = draggables[0].position.y;
    let t = InvParamX(x);
    let formulaT = new Formula('t&=\\phantom{-}\\$1').addAutoParam(
      t.toFixed(4).replace(/(\.?0+)$/, '\\phantom{$1}'),
      PrimeColor.orange
    );
    let formulaX = new Formula('x&=' + (x < 0 ? '' : '\\phantom{-}') + '\\$1').addAutoParam(
      x.toFixed(2).replace(/\.?0+$/, ''),
      PrimeColor.orange
    );
    let formulaY = new Formula('y&=' + (y < 0 ? '' : '\\phantom{-}') + '\\$1').addAutoParam(
      y.toFixed(4).replace(/\.?0+$/, ''),
      PrimeColor.orange
    );
    return new Formulas(formulaT, formulaX, formulaY).align();
  });
</script>

<Canvas2D
  {formulas}
  {draggables}
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-right"
  showFormulasDefault={true}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
