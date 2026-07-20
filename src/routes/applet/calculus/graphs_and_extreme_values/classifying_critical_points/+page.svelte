<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    Polygon,
    Text,
    FunctionFragment,
    Point
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';

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
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(0, -2), // bottom-left
    new Vector2(10, 8), // top-right
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
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: 0,
    showAxisY: true,
    additionalTicksX: [
      -0.00000000000001,
      2 * Math.PI,
      Math.PI / 3,
      (2 * Math.PI) / 3,
      (4 * Math.PI) / 3,
      (5 * Math.PI) / 3
    ]
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 1;
  let scaleY = 1 / 2;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = '';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const LabelHeight = -0.6;
  const RegionHeight = -4 * LabelHeight;
  const appletObjects: AppletObject[] = [
    new Polygon(
      [
        new Vector2(0, RegionHeight),
        new Vector2(Math.PI / 3, RegionHeight),
        new Vector2(Math.PI / 3, 0),
        new Vector2(0, 0)
      ],
      PrimeColor.darkGreen + PrimeColor.opacity(0.5),
      { fillStyle: 'full' }
    ),
    new Polygon(
      [
        new Vector2(Math.PI / 3, RegionHeight),
        new Vector2((2 * Math.PI) / 3, RegionHeight),
        new Vector2((2 * Math.PI) / 3, 0),
        new Vector2(Math.PI / 3, 0)
      ],
      PrimeColor.red + PrimeColor.opacity(0.5),
      { fillStyle: 'full' }
    ),
    new Polygon(
      [
        new Vector2((2 * Math.PI) / 3, RegionHeight),
        new Vector2((4 * Math.PI) / 3, RegionHeight),
        new Vector2((4 * Math.PI) / 3, 0),
        new Vector2((2 * Math.PI) / 3, 0)
      ],
      PrimeColor.darkGreen + PrimeColor.opacity(0.5),
      { fillStyle: 'full' }
    ),
    new Polygon(
      [
        new Vector2((4 * Math.PI) / 3, RegionHeight),
        new Vector2((5 * Math.PI) / 3, RegionHeight),
        new Vector2((5 * Math.PI) / 3, 0),
        new Vector2((4 * Math.PI) / 3, 0)
      ],
      PrimeColor.red + PrimeColor.opacity(0.5),
      { fillStyle: 'full' }
    ),
    new Polygon(
      [
        new Vector2((5 * Math.PI) / 3, RegionHeight),
        new Vector2(2 * Math.PI, RegionHeight),
        new Vector2(2 * Math.PI, 0),
        new Vector2((5 * Math.PI) / 3, 0)
      ],
      PrimeColor.darkGreen + PrimeColor.opacity(0.5),
      { fillStyle: 'full' }
    ),
    new Polygon(
      [
        new Vector2(0, -RegionHeight),
        new Vector2(Math.PI / 3, -RegionHeight),
        new Vector2(Math.PI / 3, 0),
        new Vector2(0, 0)
      ],
      PrimeColor.blue + PrimeColor.opacity(0.5),
      { fillStyle: 'full' }
    ),
    new Polygon(
      [
        new Vector2(Math.PI / 3, -RegionHeight),
        new Vector2((2 * Math.PI) / 3, -RegionHeight),
        new Vector2((2 * Math.PI) / 3, 0),
        new Vector2(Math.PI / 3, 0)
      ],
      PrimeColor.yellow + PrimeColor.opacity(0.5),
      { fillStyle: 'full' }
    ),
    new Polygon(
      [
        new Vector2((2 * Math.PI) / 3, -RegionHeight),
        new Vector2((4 * Math.PI) / 3, -RegionHeight),
        new Vector2((4 * Math.PI) / 3, 0),
        new Vector2((2 * Math.PI) / 3, 0)
      ],
      PrimeColor.blue + PrimeColor.opacity(0.5),
      { fillStyle: 'full' }
    ),
    new Polygon(
      [
        new Vector2((4 * Math.PI) / 3, -RegionHeight),
        new Vector2((5 * Math.PI) / 3, -RegionHeight),
        new Vector2((5 * Math.PI) / 3, 0),
        new Vector2((4 * Math.PI) / 3, 0)
      ],
      PrimeColor.yellow + PrimeColor.opacity(0.5),
      { fillStyle: 'full' }
    ),
    new Polygon(
      [
        new Vector2((5 * Math.PI) / 3, -RegionHeight),
        new Vector2(2 * Math.PI, -RegionHeight),
        new Vector2(2 * Math.PI, 0),
        new Vector2((5 * Math.PI) / 3, 0)
      ],
      PrimeColor.blue + PrimeColor.opacity(0.5),
      { fillStyle: 'full' }
    ),
    new Text('\\boldsymbol{+}', new Vector2(Math.PI / 6, -2 * LabelHeight), PrimeColor.darkGreen, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text('\\boldsymbol{-}', new Vector2(Math.PI / 2, -2 * LabelHeight), PrimeColor.red, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text('\\boldsymbol{+}', new Vector2(Math.PI, -2 * LabelHeight), PrimeColor.darkGreen, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text('\\boldsymbol{-}', new Vector2((3 * Math.PI) / 2, -2 * LabelHeight), PrimeColor.red, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text(
      '\\boldsymbol{+}',
      new Vector2((11 * Math.PI) / 6, -2 * LabelHeight),
      PrimeColor.darkGreen,
      {
        alignX: 'center',
        alignY: 'center'
      }
    ),
    new Text(
      '\\boldsymbol{\\uparrow}',
      new Vector2(Math.PI / 6, 2 * LabelHeight),
      PrimeColor.blue,
      {
        alignX: 'center',
        alignY: 'center'
      }
    ),
    new Text(
      '\\boldsymbol{\\downarrow}',
      new Vector2(Math.PI / 2, 2 * LabelHeight),
      PrimeColor.yellow,
      {
        alignX: 'center',
        alignY: 'center'
      }
    ),
    new Text('\\boldsymbol{\\uparrow}', new Vector2(Math.PI, 2 * LabelHeight), PrimeColor.blue, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text(
      '\\boldsymbol{\\downarrow}',
      new Vector2((3 * Math.PI) / 2, 2 * LabelHeight),
      PrimeColor.yellow,
      {
        alignX: 'center',
        alignY: 'center'
      }
    ),
    new Text(
      '\\boldsymbol{\\uparrow}',
      new Vector2((11 * Math.PI) / 6, 2 * LabelHeight),
      PrimeColor.blue,
      {
        alignX: 'center',
        alignY: 'center'
      }
    ),
    new Text('0', new Vector2(0, 0.5 * LabelHeight), PrimeColor.black, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text('2\\pi', new Vector2(2 * Math.PI, 0.5 * LabelHeight), PrimeColor.black, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text(
      '\\tfrac{1}{3}\\pi',
      new Vector2(Math.PI / 3, 0.5 * LabelHeight),
      PrimeColor.black,
      {
        alignX: 'center',
        alignY: 'center'
      }
    ),
    new Text(
      '\\tfrac{2}{3}\\pi',
      new Vector2((2 * Math.PI) / 3, 0.5 * LabelHeight),
      PrimeColor.black,
      {
        alignX: 'center',
        alignY: 'center'
      }
    ),
    new Text(
      '\\tfrac{4}{3}\\pi',
      new Vector2((4 * Math.PI) / 3, 0.5 * LabelHeight),
      PrimeColor.black,
      {
        alignX: 'center',
        alignY: 'center'
      }
    ),
    new Text(
      '\\tfrac{5}{3}\\pi',
      new Vector2((5 * Math.PI) / 3, 0.5 * LabelHeight),
      PrimeColor.black,
      {
        alignX: 'center',
        alignY: 'center'
      }
    ),
    new Text(
      'x',
      new Vector2(2 * Math.PI - 1 * LabelHeight, 0.5 * LabelHeight),
      PrimeColor.black,
      {
        alignX: 'center',
        alignY: 'center'
      }
    ),
    new Text(
      "\\text{Sign of~}f'",
      new Vector2(2 * Math.PI - 1 * LabelHeight, -2 * LabelHeight),
      PrimeColor.black,
      {
        alignX: 'left',
        alignY: 'center'
      }
    ),
    new Text(
      '\\text{Behaviour of~}f',
      new Vector2(2 * Math.PI - 1 * LabelHeight, 2 * LabelHeight),
      PrimeColor.black,
      {
        alignX: 'left',
        alignY: 'center'
      }
    ),
    new FunctionFragment((x: number) => x + Math.sin(2 * x), PrimeColor.raspberry, {
      legendText: 'f(x)=x+\\sin(2x)',
      domain: { xMin: 0, xMax: 2 * Math.PI }
    }).addIncludedPoints([new Vector2(0, 0), new Vector2(2 * Math.PI, 2 * Math.PI)]),
    new Point(
      new Vector2(Math.PI / 3, Math.PI / 3 + Math.sin((2 * Math.PI) / 3)),
      PrimeColor.orange,
      {
        legendText: '\\text{Local maximum}',
        shape: 'diamond'
      }
    ),
    new Point(
      new Vector2((2 * Math.PI) / 3, (2 * Math.PI) / 3 + Math.sin((2 * 2 * Math.PI) / 3)),
      PrimeColor.cyan,
      {
        legendText: '\\text{Local minimum}',
        shape: 'triangle'
      }
    ),
    new Point(
      new Vector2((4 * Math.PI) / 3, (4 * Math.PI) / 3 + Math.sin((2 * 4 * Math.PI) / 3)),
      PrimeColor.orange,
      {
        shape: 'diamond'
      }
    ),
    new Point(
      new Vector2((5 * Math.PI) / 3, (5 * Math.PI) / 3 + Math.sin((2 * 5 * Math.PI) / 3)),
      PrimeColor.cyan,
      {
        shape: 'triangle'
      }
    )
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
</Canvas2D>
