<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { parse, compile } from '@cortex-js/compute-engine';

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
    new Vector2(-12.5, -0.75), // bottom-left
    new Vector2(112.5, 2.75), // top-right
    0 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: false,
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
  let scaleX = 1 / 5;
  let scaleY = 4;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const LatexFunc = '\\frac{2+\\cos(x)}{x}';
  const parsed = parse(LatexFunc);
  const compiled = compile(parsed);
  const CompFunc = (x: number) => {
    const result = compiled.run?.({ x });
    return typeof result === 'number' ? result : Number(result);
  };
  const LatexFunc2 = '\\frac{1}{x}';
  const parsed2 = parse(LatexFunc2);
  const compiled2 = compile(parsed2);
  const CompFunc2 = (x: number) => {
    const result = compiled2.run?.({ x });
    return typeof result === 'number' ? result : Number(result);
  };
  const appletObjects: AppletObject[] = [
    new FunctionFragment(CompFunc, PrimeColor.blue, {
      domain: { xMin: 1, xMax: 30 / scaleX },
      legendText: LatexFunc,
      width: 0.08,
      integral: {
        xLeft: 1,
        xRight: 30 / scaleX,
        legendText: '\\int_{1}^{\\infty}' + LatexFunc + '\\,dx',
        color: PrimeColor.darkGreen,
        shape: 'square'
      }
    }).addIncludedPoints(new Vector2(1, CompFunc(1)), undefined, 0.12),
    new FunctionFragment(CompFunc2, PrimeColor.orange, {
      domain: { xMin: 1, xMax: 30 / scaleX },
      legendText: LatexFunc2,
      width: 0.08,
      integral: {
        xLeft: 1,
        xRight: 30 / scaleX,
        legendText: '\\int_{0}^{\\infty}' + LatexFunc2 + '\\,dx',
        color: PrimeColor.yellow,
        shape: 'square',
        isDashed: true
      }
    }).addIncludedPoints(new Vector2(1, CompFunc2(1)), undefined, 0.12)
  ];
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
