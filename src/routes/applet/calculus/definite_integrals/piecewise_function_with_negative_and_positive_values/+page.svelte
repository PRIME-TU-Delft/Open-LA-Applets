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
    new Vector2(-2, -5), // bottom-left
    new Vector2(10, 5), // top-right
    0.5 // margin
  );

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  let sX = 1;
  let sY = 1;

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment('1', PrimeColor.blue, {
      legendText:
        'f(x)=\\left\\{\\begin{array}{ll}1, &-2\\leq x<0\\\\2x-4, & 0\\leq x<2,\\\\-x+4, & 2\\leq x\\leq 5,\\end{array}\\right.',
      domain: { xMin: -2, xMax: 0 },
      integral: {
        xLeft: -2,
        xRight: 0,
        legendText: '\\int_{-2}^{5} f(x) dx',
        isDashed: false,
        color: PrimeColor.darkGreen,
        shape: 'square'
      }
    })
      .addGaps(new Vector2(0, 1))
      .addIncludedPoints(new Vector2(-2, 1)),
    new FunctionFragment('2x-4', PrimeColor.blue, {
      domain: { xMin: 0, xMax: 2 },
      integral: {
        xLeft: 0,
        xRight: 2,
        isDashed: false,
        color: PrimeColor.darkGreen,
        shape: 'square'
      }
    })
      .addGaps(new Vector2(2, 0))
      .addIncludedPoints(new Vector2(0, -4)),
    new FunctionFragment('-x+4', PrimeColor.blue, {
      domain: { xMin: 2, xMax: 5 },
      integral: {
        xLeft: 2,
        xRight: 5,
        isDashed: false,
        color: PrimeColor.darkGreen,
        shape: 'square'
      }
    })
      .addIncludedPoints(new Vector2(5, -1))
      .addIncludedPoints(new Vector2(2, 2))
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  position="top-right"
  axis={null}
>
  <TemplateComponent objects={appletObjects} />
  <Axis scaleX={sX} skipX={0} scaleY={sY} skipY={0} />
</Canvas2D>
