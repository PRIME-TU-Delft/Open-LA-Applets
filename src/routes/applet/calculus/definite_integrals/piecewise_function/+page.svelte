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
    new Vector2(-4, -1), // bottom-left
    new Vector2(4, 8), // top-right
    0.5 // margin
  );

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  let sX = 2;
  let sY = 3;

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment(sY + '*(x/' + sX + ')', PrimeColor.blue, {
      legendText:
        'f(x)=\\left\\{\\begin{array}{ll}x, & 0\\leq x<1,\\\\2, & 1\\leq x\\leq 2,\\\\x-1, & 2<x\\leq 3.\\end{array}\\right.',
      domain: { xMin: 0, xMax: 1 * sX },
      integral: {
        xLeft: 0,
        xRight: 1 * sX,
        legendText: '\\int_{0}^{3} f(x) dx',
        isDashed: false,
        color: PrimeColor.darkGreen,
        shape: 'square'
      }
    })
      .addGaps([new Vector2(1 * sX, 1 * sY), new Vector2(2 * sX, 1 * sY)])
      .addIncludedPoints([
        new Vector2(0 * sX, 0 * sY),
        new Vector2(1 * sX, 2 * sY),
        new Vector2(2 * sX, 2 * sY),
        new Vector2(3 * sX, 2 * sY)
      ]),
    new FunctionFragment(sY + '*2', PrimeColor.blue, {
      domain: { xMin: 1 * sX, xMax: 2 * sX },
      integral: {
        xLeft: 1 * sX,
        xRight: 2 * sX,
        isDashed: false,
        color: PrimeColor.darkGreen
      }
    }),
    new FunctionFragment(sY + '*(x/' + sX + '-1)', PrimeColor.blue, {
      domain: { xMin: 2 * sX, xMax: 3 * sX },
      integral: {
        xLeft: 2 * sX,
        xRight: 3 * sX,
        isDashed: false,
        color: PrimeColor.darkGreen
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
  position="top-left"
  axis={null}
>
  <TemplateComponent objects={appletObjects} />
  <Axis scaleX={sX} skipX={1} scaleY={sY} skipY={2} />
</Canvas2D>
