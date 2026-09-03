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
  xAxisLabel = 't';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const x = 3;
  const h = 0.5;
  const appletObjects: AppletObject[] = [
    new FunctionFragment(
      '-\\frac{2}{7}x^{3} + 3x^{2} - \\frac{135}{14}x + \\frac{153}{14}',
      PrimeColor.blue,
      {
        legendText: 'f(t)',
        integral: {
          xLeft: x,
          xRight: x + h,
          legendText: '\\int_{x}^{x+h} f(t)\\,dt',
          isDashed: false,
          color: PrimeColor.darkGreen,
          shape: 'square'
        }
      }
    )
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
    showGridLinesX={true}
    showGridLinesY={false}
    skipX={-1}
    skipY={-1}
    additionalTicksX={[1, 5, x, x + h]}
  />
  <Latex2D latex="a" position={new Vector2(1, -0.15)} alignX="right" />
  <Latex2D latex="b" position={new Vector2(5, -0.15)} alignX="left" />
  <Latex2D latex="x" position={new Vector2(x, -0.15)} alignX="right" />
  <Latex2D latex="x+h" position={new Vector2(x + h, -0.15)} alignX="left" />
</Canvas2D>
