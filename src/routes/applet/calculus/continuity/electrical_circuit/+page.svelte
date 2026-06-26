<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    FunctionFragment,
    LineFragment,
    Polygon,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';

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
    new Vector2(-8, -1), // bottom-left
    new Vector2(8, 7), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 0,
    skipY: 0
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
  yAxisLabel = 'i';

  // ##############
  // APPLET OBJECTS
  // ##############
  const i0 = 4;
  const appletObjects: AppletObject[] = [
    new FunctionFragment('0', PrimeColor.blue, {
      domain: { xMax: 0 },
      legendText: 'i(t)'
    }).addGaps(new Vector2(0, 0)),
    new FunctionFragment((x: number) => i0 * Math.exp(-x), PrimeColor.blue, {
      domain: { xMin: 0 }
    }).addIncludedPoints([new Vector2(0, i0)]),
    new Polygon(
      [new Vector2(-2, 1), new Vector2(-2, 6), new Vector2(-7, 6), new Vector2(-7, 1)],
      PrimeColor.blue
    ),
    new LineFragment(new Vector2(-2, 3.4), new Vector2(-2, 3.6), PrimeColor.white, { width: 0.06 }),
    new LineFragment(new Vector2(-2.5, 3.4), new Vector2(-1.5, 3.4), PrimeColor.darkGreen, {
      width: 0.05
    }),
    new LineFragment(new Vector2(-2.5, 3.6), new Vector2(-1.5, 3.6), PrimeColor.darkGreen, {
      width: 0.05
    }),
    new Text(
      '\\begin{array}{c}\\boldsymbol{+}\\\\v\\\\\\boldsymbol{-}\\end{array}',
      new Vector2(-1.55, 3.5),
      PrimeColor.darkGreen,
      { alignX: 'left', alignY: 'center' }
    ),
    new Text('C', new Vector2(-2.65, 3.5), PrimeColor.darkGreen, {
      alignX: 'right',
      alignY: 'center'
    }),
    new Text('V_s', new Vector2(-7.7, 3.5), PrimeColor.raspberry, {
      alignX: 'right',
      alignY: 'center'
    }),
    new LineFragment(new Vector2(-6, 6), new Vector2(-5, 6), PrimeColor.white, { width: 0.06 }),
    new Text('R', new Vector2(-5.5, 6.3), PrimeColor.darkGreen, {
      alignX: 'center',
      alignY: 'bottom'
    }),
    new LineFragment(new Vector2(-4, 6), new Vector2(-3, 6), PrimeColor.white, { width: 0.06 }),
    new LineFragment(new Vector2(-4, 6), new Vector2(-3, 6.5), PrimeColor.black, { width: 0.05 }),
    new Text('t<0', new Vector2(-3.5, 6.5), PrimeColor.black, {
      alignX: 'center',
      alignY: 'bottom'
    }),
    new LineFragment(new Vector2(-4, 6), new Vector2(-2.9, 6.15), PrimeColor.orange, {
      width: 0.05
    }),
    new Text('t\\geq0', new Vector2(-3.5, 6.0), PrimeColor.orange, {
      alignX: 'center',
      alignY: 'top'
    })
  ];
  const DeltaX = 1 / 16;
  const DeltaY = 1 / 4;
  for (let i = 1; i < 16; i += 4) {
    const Zig = new LineFragment(
      new Vector2(-6 + (i - 1) * DeltaX, 6),
      new Vector2(-6 + i * DeltaX, 6 + DeltaY),
      PrimeColor.darkGreen,
      { width: 0.05 }
    );
    appletObjects.push(Zig);
    const Zag = new LineFragment(
      new Vector2(-6 + i * DeltaX, 6 + DeltaY),
      new Vector2(-6 + (i + 1) * DeltaX, 6),
      PrimeColor.darkGreen,
      { width: 0.05 }
    );
    appletObjects.push(Zag);
    const Zig2 = new LineFragment(
      new Vector2(-6 + (i + 1) * DeltaX, 6),
      new Vector2(-6 + (i + 2) * DeltaX, 6 - DeltaY),
      PrimeColor.darkGreen,
      { width: 0.05 }
    );
    appletObjects.push(Zig2);
    const Zag2 = new LineFragment(
      new Vector2(-6 + (i + 2) * DeltaX, 6 - DeltaY),
      new Vector2(-6 + (i + 3) * DeltaX, 6),
      PrimeColor.darkGreen,
      { width: 0.05 }
    );
    appletObjects.push(Zag2);
  }
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <Circle2D
    fill={PrimeColor.yellow}
    color={PrimeColor.raspberry}
    radius={0.5}
    position={new Vector2(-7, 3.5)}
  />
  <Latex2D
    latex="\begin{'{'}array{'}'}{'{'}c{'}'}\boldsymbol{'{'}+{'}'}\\\boldsymbol{'{'}-{'}'}\end{'{'}array{'}'}"
    position={new Vector2(-7, 3.5)}
    alignX="center"
    alignY="center"
    color={PrimeColor.raspberry}
  />
  <Point2D
    position={new Vector2(-4, 6.0)}
    color={PrimeColor.blue}
    radius={0.1}
    fill={PrimeColor.white}
  />
  <Point2D
    position={new Vector2(-3, 6.0)}
    color={PrimeColor.blue}
    radius={0.1}
    fill={PrimeColor.white}
  />
</Canvas2D>
