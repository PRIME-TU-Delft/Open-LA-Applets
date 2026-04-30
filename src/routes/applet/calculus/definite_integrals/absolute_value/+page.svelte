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
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Latex from '$lib/components/Latex.svelte';

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
  initialViewBox = new ViewBox(
    new Vector2(-5, -4), // bottom-left
    new Vector2(5, 6), // top-right
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
    new FunctionFragment('|x|', PrimeColor.blue, {
      legendText: '|x|',
      integral: {
        xLeft: (-Math.PI * 7) / 8,
        xRight: (Math.PI * 7) / 8,
        legendText: '\\int_{-a}^{a} |x| dx',
        isDashed: false,
        color: PrimeColor.darkGreen,
        shape: 'square'
      }
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  legendFormulaPosition="top-left"
  axis={null}
>
  <TemplateComponent objects={appletObjects} />
  <Axis
    skipX={100}
    skipY={100}
    showAxisNumbersX={false}
    showAxisNumbersY={false}
    additionalTicksX={[(-7 / 8) * Math.PI, (7 / 8) * Math.PI]}
    additionalTicksY={[(7 / 8) * Math.PI]}
  />
  <Latex2D latex="a" position={new Vector2((7 / 8) * Math.PI, -0.15)} alignX="center" />
  <Latex2D latex="-a" position={new Vector2((-7 / 8) * Math.PI, -0.15)} alignX="center" />
  <Latex2D
    latex="a"
    position={new Vector2(-0.15, (7 / 8) * Math.PI)}
    alignY="center"
    alignX="right"
  />
</Canvas2D>
