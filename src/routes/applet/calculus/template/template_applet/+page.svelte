<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */ // For ease of creating the template applets
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
    new Vector2(-3, -4), // bottom-left
    new Vector2(4, 7), // top-right
    0.5 // margin
  );

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
    new Text('\\pi', new Vector2(3, 3.14), PrimeColor.orange, {
      alignX: 'center'
    }),
    Angle.fromVectors(
      new Vector2(6, 1),
      new Vector2(1, 1),
      new Vector2(0, 1),
      PrimeColor.raspberry
    ),
    new Point(new Vector2(5, 3), PrimeColor.yellow, {
      latex: '\\sigma',
      legendText: '\\sigma',
      shape: 'square'
    }),
    new ImplicitFunctionFragment('x^2 + y^2 = 3', PrimeColor.orange, {
      domain: {
        xMin: 1,
        xMax: 1.3
      }
    }),
    new ParameterizedFunctionFragment('\\sin{t}', '\\cos{t}', PrimeColor.cyan, {
      tStart: 0,
      tEnd: Math.PI,
      legendText: 'parameterized',
      shape: 'triangle'
    }).addGaps(new Vector2(0, -1)),
    new FunctionFragment((x: number) => x ** 2 - 2, PrimeColor.raspberry, {
      domain: { xMin: -1, xMax: 2.14 }
    }),
    new FunctionFragment('\\frac{{x+1}^2}{x+1}', PrimeColor.blue, {
      domain: { xMax: 3 },
      isDashed: false,
      shape: 'square',
      legendText: 'f(x)'
    })
      .addGaps(new Vector2(-1, 0), toLatexText('gaps'))
      .addIncludedPoints(new Vector2(3, 4), toLatexText('included')),
    new FunctionFragment('e^x', PrimeColor.darkGreen, {
      integral: {
        xLeft: -4,
        xRight: -1.25,
        isDashed: true
      },
      legendText: 'g(x)'
    }),
    new AsymptoteFragment(2, 'vertical', PrimeColor.cyan),
    new AsymptoteFragment(-1.5, 'horizontal', PrimeColor.black),
    new ObliqueAsymptoteFragment('x+2', PrimeColor.orange),
    new LineFragment(new Vector2(2, -3), new Vector2(5, -3), PrimeColor.raspberry, {
      latex: 'test'
    }),
    new Circle(new Vector2(-5, 3), 3, PrimeColor.blue, true),
    new Polygon([new Vector2(-5, 3), new Vector2(-2, 3), new Vector2(-5, 0)], PrimeColor.cyan, {
      sideLatex: ['a', 'b', 'c']
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
