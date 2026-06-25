<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';

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
  cameraPosition = new Vector2(3, 1);
  cameraZoom = 0.5;

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
  const appletObjects: AppletObject[] = [];
  // loop over intervals and create a function fragment for each interval
  for (let i = 0; i <= 30 / scaleX - 2; i += 2) {
    const intervalStart = i;
    const intervalEnd = i + 1;
    if (intervalStart === 0) {
      const functionFragment2 = new FunctionFragment((x: number) => 1 / x, PrimeColor.blue, {
        domain: { xMin: intervalStart + 1, xMax: intervalEnd + 1 },
        legendText: 'y=g(x)'
      })
        .addGaps(new Vector2(intervalStart + 2, 1 / (intervalStart + 2)))
        .addIncludedPoints(new Vector2(intervalStart + 1, 1 / (intervalStart + 1)));
      appletObjects.push(functionFragment2);
      const functionFragment4 = new FunctionFragment((x: number) => 1 * x, PrimeColor.darkGreen, {
        domain: { xMin: intervalStart + 1, xMax: intervalEnd + 1 },
        legendText: 'y=\\frac{1}{g(x)}'
      })
        .addGaps(new Vector2(intervalStart + 2, 1 * (intervalStart + 2)))
        .addIncludedPoints(new Vector2(intervalStart + 1, 1 * (intervalStart + 1)));
      appletObjects.push(functionFragment4);
    } else {
      const functionFragment = new FunctionFragment((x: number) => -1 / x, PrimeColor.blue, {
        domain: { xMin: intervalStart, xMax: intervalEnd }
      })
        .addGaps(new Vector2(intervalStart + 1, -1 / (intervalStart + 1)))
        .addIncludedPoints(new Vector2(intervalStart, -1 / intervalStart));
      appletObjects.push(functionFragment);
      const functionFragment2 = new FunctionFragment((x: number) => 1 / x, PrimeColor.blue, {
        domain: { xMin: intervalStart + 1, xMax: intervalEnd + 1 }
      })
        .addGaps(new Vector2(intervalStart + 2, 1 / (intervalStart + 2)))
        .addIncludedPoints(new Vector2(intervalStart + 1, 1 / (intervalStart + 1)));
      appletObjects.push(functionFragment2);
      const functionFragment3 = new FunctionFragment((x: number) => -1 * x, PrimeColor.darkGreen, {
        domain: { xMin: intervalStart, xMax: intervalEnd }
      })
        .addGaps(new Vector2(intervalStart + 1, -1 * (intervalStart + 1)))
        .addIncludedPoints(new Vector2(intervalStart, -1 * intervalStart));
      appletObjects.push(functionFragment3);
      const functionFragment4 = new FunctionFragment((x: number) => 1 * x, PrimeColor.darkGreen, {
        domain: { xMin: intervalStart + 1, xMax: intervalEnd + 1 }
      })
        .addGaps(new Vector2(intervalStart + 2, 1 * (intervalStart + 2)))
        .addIncludedPoints(new Vector2(intervalStart + 1, 1 * (intervalStart + 1)));
      appletObjects.push(functionFragment4);
    }
  }
</script>

<Canvas2D
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-left"
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
