<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */ // For ease of creating the template applets
  import {
    AppletObject,
    AsymptoteFragment,
    FunctionFragment,
    ObliqueAsymptoteFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Axis from '$lib/d3/Axis.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
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
  cameraPosition = new Vector2(3, 1);
  cameraZoom = 1.5;

  // (remove if unnecessary)
  let sY = 0.2; // scale for y-axis to make the graph look better

  initialViewBox = new ViewBox(
    new Vector2(-1, -1 * sY), // bottom-left
    new Vector2(15, 25 * sY), // top-right
    0.5 // margin
  );

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 't';
  yAxisLabel = 'T(t)';

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment('(5+15\\cdot e^{-x})*' + sY, PrimeColor.blue, {
      domain: { xMin: 0 },
      isDashed: false,
      shape: 'circle',
      legendText: 'T(t)=5+15e^{-t}'
    }).addIncludedPoints(new Vector2(0, 20 * sY)),
    new FunctionFragment('5*' + sY, PrimeColor.darkGreen, {
      domain: { xMin: 0 },
      isDashed: true,
      shape: 'triangle',
      legendText: 'T(t)=5'
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  axis={null}
>
  <TemplateComponent objects={appletObjects} />
  <Axis scaleY={sY} />
</Canvas2D>
