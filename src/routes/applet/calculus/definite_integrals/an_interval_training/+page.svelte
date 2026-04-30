<script lang="ts">
  // For ease of creating the template applets
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import {
    Angle,
    AppletObject,
    AsymptoteFragment,
    Circle,
    FunctionFragment,
    ImplicitFunctionFragment,
    LineFragment,
    ObliqueAsymptoteFragment,
    ParameterizedFunctionFragment,
    Point,
    Polygon,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { number } from 'svelte-i18n';
  import type { float } from 'three/tsl';
  /* eslint-enable @typescript-eslint/no-unused-vars */

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
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
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  cameraPosition = new Vector2(6, 4);
  cameraZoom = 0.85;

  // (remove if unnecessary)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  initialViewBox = new ViewBox(
    new Vector2(-2, -2), // bottom-left
    new Vector2(12, 12), // top-right
    0.5 // margin
  );
  /* eslint-disable @typescript-eslint/no-unused-vars */

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  let sX: number | undefined;
  let sY: number | undefined;
  sX = 1 / 2;
  sY = 1 / 2;
  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    scaleX: sX,
    scaleY: sY,
    skipX: 0,
    skipY: 0
  };

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 't';
  yAxisLabel = 'v';

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment('5*' + sY, PrimeColor.blue, {
      domain: { xMin: 0, xMax: 5 * sX },
      legendText: 'v(t)',
      integral: {
        xLeft: 0,
        xRight: 5 * sX,
        isDashed: false,
        color: PrimeColor.darkGreen
      }
    }),
    new FunctionFragment('15*' + sY, PrimeColor.blue, {
      domain: { xMin: 5 * sX, xMax: 7 * sX },
      integral: {
        xLeft: 5 * sX,
        xRight: 7 * sX,
        isDashed: false,
        color: PrimeColor.raspberry
      }
    }),
    new FunctionFragment('6*' + sY, PrimeColor.blue, {
      domain: { xMin: 7 * sX, xMax: 11 * sX },
      integral: {
        xLeft: 7 * sX,
        xRight: 11 * sX,
        isDashed: false,
        color: PrimeColor.yellow
      }
    }),
    new FunctionFragment('20*' + sY, PrimeColor.blue, {
      domain: { xMin: 11 * sX, xMax: 14 * sX },
      integral: {
        xLeft: 11 * sX,
        xRight: 14 * sX,
        isDashed: false,
        color: PrimeColor.cyan
      }
    }),
    new FunctionFragment('4*' + sY, PrimeColor.blue, {
      domain: { xMin: 14 * sX, xMax: 20 * sX },
      integral: {
        xLeft: 14 * sX,
        xRight: 20 * sX,
        isDashed: false,
        color: PrimeColor.orange
      }
    })
  ];
</script>

<Canvas2D
  // {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
