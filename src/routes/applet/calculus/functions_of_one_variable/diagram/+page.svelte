<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // For ease of creating the template applets
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
  import Vector2D from '$lib/d3/Vector2D.svelte';

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
  cameraPosition = new Vector2(3, 1);
  cameraZoom = 1.5;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-4, -2), // bottom-left
    new Vector2(4, 2), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: false,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    scaleX: 1,
    scaleY: 1,
    skipX: -1,
    skipY: -1,
    showAxisX: false,
    showAxisY: false,
    showGridLinesX: false,
    showGridLinesY: false
  };

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = '';
  yAxisLabel = '';

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment('\\sqrt{3-2(x+2)^2}', PrimeColor.blue, {
      domain: {
        xMin: -10,
        xMax: 10
      },
      integral: { xLeft: -10, xRight: 10, color: PrimeColor.blue }
    }),
    new FunctionFragment('-\\sqrt{3-2(x+2)^2}', PrimeColor.blue, {
      domain: {
        xMin: -10,
        xMax: 10
      },
      integral: { xLeft: -10, xRight: 10, color: PrimeColor.blue }
    }),
    new ImplicitFunctionFragment('2(x+2)^2 + y^2 = 3', PrimeColor.blue, {
      domain: {
        xMin: -10,
        xMax: 10
      }
    }),
    new FunctionFragment('\\sqrt{3-2(x-2)^2}', PrimeColor.darkGreen, {
      domain: {
        xMin: -10,
        xMax: 10
      },
      integral: { xLeft: -10, xRight: 10, color: PrimeColor.darkGreen }
    }),
    new FunctionFragment('-\\sqrt{3-2(x-2)^2}', PrimeColor.darkGreen, {
      domain: {
        xMin: -10,
        xMax: 10
      },
      integral: { xLeft: -10, xRight: 10, color: PrimeColor.darkGreen }
    }),
    new ImplicitFunctionFragment('2(x-2)^2 + y^2 = 3', PrimeColor.darkGreen, {
      domain: {
        xMin: -10,
        xMax: 10
      }
    }),
    new Point(new Vector2(-2.5, 1), PrimeColor.raspberry),
    new Point(new Vector2(1.5, 0.9), PrimeColor.raspberry, { shape: 'square' }),
    new Point(new Vector2(-1.5, 0.6), PrimeColor.raspberry),
    new Point(new Vector2(-2, -0.2), PrimeColor.raspberry),
    new Point(new Vector2(1.7, -0.5), PrimeColor.raspberry, { shape: 'square' }),
    new Point(new Vector2(-2.6, -0.8), PrimeColor.raspberry),
    new Point(new Vector2(1.2, -0.9), PrimeColor.raspberry, { shape: 'square' }),
    new Point(new Vector2(2.6, -0.8), PrimeColor.orange, { shape: 'triangle' }),
    new Point(new Vector2(2.5, 0.8), PrimeColor.orange, { shape: 'triangle' }),
    new Point(new Vector2(2, 0.1), PrimeColor.orange, { shape: 'triangle' }),
    new Text('f', new Vector2(0, 1.6), PrimeColor.black, { alignX: 'center', alignY: 'bottom' }),
    new Text('D_f', new Vector2(-2, -2), PrimeColor.blue, { alignX: 'center', alignY: 'center' }),
    new Text('C_f', new Vector2(2, -2), PrimeColor.darkGreen, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text('x', new Vector2(-2.5, 1.1), PrimeColor.raspberry, {
      alignX: 'center',
      alignY: 'bottom'
    }),
    new Text('f(x)', new Vector2(1.5, 1.1), PrimeColor.raspberry, {
      alignX: 'center',
      alignY: 'bottom'
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
>
  <TemplateComponent objects={appletObjects} />
  <Vector2D
    color={PrimeColor.black}
    origin={new Vector2(-1, 1.5)}
    direction={new Vector2(2, 0)}
    length={2}
    isDashed
  ></Vector2D>
  <Vector2D
    color={PrimeColor.black}
    origin={new Vector2(-2.5, 1)}
    direction={new Vector2(4, -0.1)}
    length={Math.sqrt(4 ** 2 + 0.1 ** 2)}
  ></Vector2D>
  <Vector2D
    color={PrimeColor.black}
    origin={new Vector2(-1.5, 0.6)}
    direction={new Vector2(3.2, -1.1)}
    length={Math.sqrt(3.2 ** 2 + 1.1 ** 2)}
  ></Vector2D>
  <Vector2D
    color={PrimeColor.black}
    origin={new Vector2(-2, -0.2)}
    direction={new Vector2(3.7, -0.3)}
    length={Math.sqrt(3.7 ** 2 + 0.3 ** 2)}
  ></Vector2D>
  <Vector2D
    color={PrimeColor.black}
    origin={new Vector2(-2.6, -0.8)}
    direction={new Vector2(3.8, -0.1)}
    length={Math.sqrt(3.8 ** 2 + 0.1 ** 2)}
  ></Vector2D>
</Canvas2D>
