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
    new Vector2(-4, -4), // bottom-left
    new Vector2(8, 8), // top-right
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
    new FunctionFragment('\\sqrt{x}', PrimeColor.blue, {
      isDashed: false,
      shape: 'square',
      legendText: 'h(x)=\\sqrt{x}'
    }),
    new FunctionFragment('x^2', PrimeColor.orange, {
      isDashed: false,
      shape: 'circle',
      legendText: 'q(x)=x^2'
    }),
    new FunctionFragment('x^2', PrimeColor.darkGreen, {
      isDashed: true,
      shape: 'circle',
      legendText: 'h^{-1}(x)=x^2',
      domain: { xMin: 0 }
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
