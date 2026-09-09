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
    new Vector2(-1, -2), // bottom-left
    new Vector2(7, 8), // top-right
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
    new FunctionFragment('-30', PrimeColor.blue, {
      isDashed: false,
      shape: 'circle',
      legendText: 'f(x)',
      domain: { xMin: -30, xMax: -30 + 0.5 }
    }).addGaps(new Vector2(-30 + 0.5, -30))
  ];
  for (let i = -29; i < 30; i++) {
    appletObjects.push(
      new FunctionFragment(i.toString(), PrimeColor.blue, {
        isDashed: false,
        shape: 'circle',
        domain: { xMin: i - 0.5, xMax: i + 0.5 }
      })
        .addGaps(new Vector2(i + 0.5, i))
        .addIncludedPoints(new Vector2(i - 0.5, i))
    );
  }
  appletObjects.push(
    new FunctionFragment('30', PrimeColor.blue, {
      isDashed: false,
      shape: 'circle',
      domain: { xMin: 30 - 0.5, xMax: 30 }
    }).addIncludedPoints(new Vector2(30 - 0.5, 30))
  );
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  legendFormulaPosition="top-left"
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
