<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';

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
    new Vector2(-1.5, -1), // bottom-left
    new Vector2(10, 2), // top-right
    0.25 // margin
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
  let scaleX = 2;
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
  const startX = 0;
  const startN = 1;
  const endX = 15;
  const endN = 15;

  function Map(x: number): number {
    return x / (1 + x);
  }

  const baseSize = 0.12;

  const appletObjects: AppletObject[] = [
    new FunctionFragment(Map, PrimeColor.blue, {
      domain: { xMin: startX, xMax: endX },
      width: baseSize,
      legendText: 'f(x)=\\frac{x}{1+x}',
      shape: 'square'
    }),
    new Point(new Vector2(startN, Map(startN)), PrimeColor.orange, {
      latex: 'a_1',
      legendText: toLatexText('$\\left(a_n\\right)_{n=1}^{\\infty}$ with $a_n=\\dfrac{n}{1+n}$'),
      radius: 1.5 * baseSize
    })
  ];
  for (let n = 2; n <= endN; n++) {
    appletObjects.push(
      new Point(new Vector2(n, Map(n)), PrimeColor.orange, {
        latex: 'a_{' + n + '}',
        radius: 1.5 * baseSize
      })
    );
  }
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
