<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;

  // ########################
  // TUTORIAL / DOCUMENTATION
  // ########################
  // https://docs.openla.ewi.tudelft.nl/?path=/docs/tutorials-tutorial-template--docs
  // on this page you can find documentation for the template objects and a tutorial on using them

  // ###############
  // CAMERA SETTINGS
  // ###############
  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-1, -1), // bottom-left
    new Vector2(11, 8), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: -1,
    additionalTicksX: [3, 7],
    additionalTicksY: [5]
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 1;
  let scaleY = 1;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 't';
  yAxisLabel = "y'";

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment(
      (x: number) => 10 * (0.6 - 0.4 * (x / 10 - 0.7) ** 2 + 0.1 * (x / 10 - 0.7)),
      PrimeColor.blue,
      {
        domain: {
          xMin: 0.5,
          xMax: 9
        },
        width: 0.08,
        legendText: "y'=f(t,y(t))"
      }
    ),
    new FunctionFragment((x: number) => 5, PrimeColor.darkGreen, {
      domain: {
        xMin: 3,
        xMax: 7
      },
      integral: {
        xLeft: 3,
        xRight: 7
      },
      width: 0.08
    }),
    new Point(new Vector2(3, 5), PrimeColor.orange, { radius: 0.12 })
  ];
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <Latex2D
    latex="t_n"
    position={new Vector2(3, 0)}
    alignX="center"
    alignY="top"
    offset={new Vector2(0, -0.15)}
    background={PrimeColor.white}
  />
  <Latex2D
    latex={toLatexText('$t_{n+1}$')}
    position={new Vector2(7, 0)}
    alignX="center"
    alignY="top"
    offset={new Vector2(0, -0.15)}
    background={PrimeColor.white}
  />
  <Latex2D
    latex="f(t_n,y(t_n))"
    position={new Vector2(0, 5)}
    alignX="right"
    alignY="center"
    offset={new Vector2(-0.15, 0)}
    background={PrimeColor.white}
  />
</Canvas2D>
