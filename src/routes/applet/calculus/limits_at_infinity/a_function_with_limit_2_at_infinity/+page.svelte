<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    AsymptoteFragment,
    FunctionFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';

  let initialViewBox: ViewBox | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;

  // ########################
  // TUTORIAL / DOCUMENTATION
  // ########################
  // https://docs.openla.ewi.tudelft.nl/?path=/docs/tutorials-tutorial-template--docs
  // on this page you can find documentation for the template objects and a tutorial on using them

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used

  const scaleX = 1 / 2;
  const scaleY = 1;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(0, -2), // bottom-left
    new Vector2(24, 10), // top-right
    0.5 // margin
  );

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment('\\frac{4+\\frac{1}{x}}{2-\\frac{3}{x^2}}', PrimeColor.blue, {
      isDashed: false,
      shape: 'circle',
      legendText: 'f(x)=\\frac{4+\\frac{1}{x}}{2-\\frac{3}{x^2}}'
    }).addGaps(new Vector2(0, 0)),
    new FunctionFragment('2', PrimeColor.darkGreen, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'y=2'
    }),
    new FunctionFragment('', PrimeColor.raspberry, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'x=\\pm\\sqrt{\\frac{3}{2}}'
    }),
    new AsymptoteFragment(Math.sqrt(1.5), 'vertical', PrimeColor.raspberry),
    new AsymptoteFragment(-Math.sqrt(1.5), 'vertical', PrimeColor.raspberry)
  ];
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
