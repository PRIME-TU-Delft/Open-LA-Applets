<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
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

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-1, -1 / 2), // bottom-left
    new Vector2(1, 1), // top-right
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
    new FunctionFragment('-x^2', PrimeColor.blue, {
      isDashed: false,
      shape: 'circle',
      legendText: 'f(x)=-x^2'
    }),
    new FunctionFragment('x^2\\sin\\left(\\frac{1}{x}\\right)', PrimeColor.raspberry, {
      isDashed: false,
      shape: 'square',
      legendText: 'g(x)=x^2\\sin\\left(\\frac{1}{x}\\right)'
    }),
    new FunctionFragment('x^2', PrimeColor.darkGreen, {
      isDashed: false,
      shape: 'square',
      legendText: 'h(x)=x^2'
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  scaleX={4}
  scaleY={2}
  axis={{
    skipX: 1
  }}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
