<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Axis from '$lib/d3/Axis.svelte';
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

  // // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-4, 0), // bottom-left
    new Vector2(4, 3), // top-right
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
    new FunctionFragment('x', PrimeColor.blue, {
      legendText:
        'f(x)=\\left\\{\\begin{array}{ll}x, & 0\\leq x<1,\\\\2, & 1\\leq x\\leq 2,\\\\x-1, & 2<x\\leq 3.\\end{array}\\right.',
      domain: { xMin: 0, xMax: 1 },
      integral: {
        xLeft: 0,
        xRight: 1,
        legendText: '\\int_{0}^{3} f(x) dx',
        isDashed: false,
        color: PrimeColor.darkGreen,
        shape: 'square'
      }
    })
      .addGaps([new Vector2(1, 1), new Vector2(2, 1)])
      .addIncludedPoints([
        new Vector2(0, 0),
        new Vector2(1, 2),
        new Vector2(2, 2),
        new Vector2(3, 2)
      ]),
    new FunctionFragment('2', PrimeColor.blue, {
      domain: { xMin: 1, xMax: 2 },
      integral: {
        xLeft: 1,
        xRight: 2,
        isDashed: false,
        color: PrimeColor.darkGreen
      }
    }),
    new FunctionFragment('x-1', PrimeColor.blue, {
      domain: { xMin: 2, xMax: 3 },
      integral: {
        xLeft: 2,
        xRight: 3,
        isDashed: false,
        color: PrimeColor.darkGreen
      }
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  legendFormulaPosition="top-left"
  axis={null}
>
  <TemplateComponent objects={appletObjects} />
  <Axis skipX={0} skipY={0} />
</Canvas2D>
