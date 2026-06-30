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
    new Vector2(-2 / 1.5, -4 / 3), // bottom-left
    new Vector2(11 / 1.5, 6 / 3), // top-right
    0.5 // margin
  );

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  let sX = 1.5;
  let sY = 3;

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment('\\cos(x)', PrimeColor.blue, {
      domain: { xMin: 0, xMax: 2 * Math.PI },
      integral: {
        xLeft: 0,
        xRight: 2 * Math.PI,
        legendText: '\\int_{0}^{2\\pi} \\cos(x) dx',
        isDashed: false,
        color: PrimeColor.darkGreen,
        shape: 'square'
      }
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  legendFormulaPosition="top-right"
  scaleX={sX}
  scaleY={sY}
  axis={null}
>
  <TemplateComponent objects={appletObjects} />
  <Axis
    skipX={100}
    skipY={2}
    showAxisNumbersX={false}
    additionalTicksX={[0.5 * Math.PI, Math.PI, 1.5 * Math.PI, 2 * Math.PI]}
  />
  <Latex2D latex="\frac12\pi" position={new Vector2(0.5 * Math.PI, -0.15)} alignX="right" />
  <Latex2D latex="\pi" position={new Vector2(Math.PI, 0.15)} alignX="center" alignY="bottom" />
  <Latex2D latex="\frac32\pi" position={new Vector2(1.5 * Math.PI, -0.15)} alignX="left" />
  <Latex2D latex="2\pi" position={new Vector2(2 * Math.PI, -0.15)} alignX="center" />
</Canvas2D>
