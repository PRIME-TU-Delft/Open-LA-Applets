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

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-5, -5), // bottom-left
    new Vector2(6, 6), // top-right
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
    new FunctionFragment('x^2-4x', PrimeColor.blue, {
      isDashed: false,
      shape: 'square',
      legendText: 'f(x)=x^2-4x',
      domain: { xMax: 2 }
    }),
    new FunctionFragment('2-\\sqrt{4+x}', PrimeColor.darkGreen, {
      isDashed: false,
      shape: 'circle',
      legendText: 'f^{-1}(x)=2-\\sqrt{4+x}',
      domain: { xMin: -4 }
    }),
    new FunctionFragment('x', PrimeColor.raspberry, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'y=x'
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
