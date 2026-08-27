<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */ // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Axis from '$lib/d3/Axis.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import Latex2D from '$lib/d3/Latex2D.svelte';

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
    new Vector2(-1, -1), // bottom-left
    new Vector2(6, 5), // top-right
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
  const c = 1.6719168070211921;
  const fc = ((52 / 7) * 1) / (5 - 1);
  const appletObjects: AppletObject[] = [
    new FunctionFragment(
      '-\\frac{2}{7}x^{3} + 3x^{2} - \\frac{135}{14}x + \\frac{153}{14}',
      PrimeColor.blue,
      {
        legendText: 'f(x)',
        integral: {
          xLeft: 1,
          xRight: 5,
          legendText: '\\int_{a}^{b} f(x) dx',
          isDashed: false,
          color: PrimeColor.darkGreen,
          shape: 'square'
        }
      }
    ),
    new FunctionFragment(fc.toString(), PrimeColor.raspberry, {
      legendText: 'f(c)',
      isDashed: true,
      shape: 'triangle',
      domain: { xMin: 1, xMax: 5 },
      integral: {
        xLeft: 1,
        xRight: 5,
        legendText: '(b-a)f(c)',
        isDashed: true,
        color: PrimeColor.grey,
        shape: 'diamond'
      }
    }),
    new Point(new Vector2(c, fc), PrimeColor.orange, {
      radius: 0.08
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  axis={null}
>
  <TemplateComponent objects={appletObjects} />
  <Axis
    showAxisNumbersX={false}
    showAxisNumbersY={false}
    showGridLinesX={false}
    showGridLinesY={false}
    skipX={100}
    skipY={100}
    additionalTicksX={[1, 5, c]}
    additionalTicksY={[fc]}
  />
  <Latex2D latex="a" position={new Vector2(1, -0.15)} alignX="center" />
  <Latex2D latex="b" position={new Vector2(5, -0.15)} alignX="center" />
  <Latex2D latex="c" position={new Vector2(c, -0.15)} alignX="center" />
  <Latex2D latex="f(c)" position={new Vector2(-0.15, fc)} alignX="right" alignY="center" />
</Canvas2D>
