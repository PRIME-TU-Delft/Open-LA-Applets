<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
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
    new Vector2(-3, -4), // bottom-left
    new Vector2(4, 7), // top-right
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
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const initialA = 0.4;
  const InitialDeltaX = 1.2;
  function BaseFunction(x: number): number {
    return Math.atan(3 * x - 1) + 2;
  }
  function BaseDerivative(x: number): number {
    return 3 / (1 + Math.pow(3 * x - 1, 2));
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment(BaseFunction, PrimeColor.blue, {
      legendText: 'f(x)',
      width: 0.1
    })
  ];
  function SnapToFunction(position: Vector2): Vector2 {
    const x = Number(position.x.toFixed(2)); // in increments of 0.01;
    const y = BaseFunction(x);
    return new Vector2(x, y);
  }
  const draggables = [
    new Draggable(
      new Vector2(initialA, BaseFunction(initialA)),
      PrimeColor.orange,
      undefined,
      SnapToFunction,
      undefined,
      undefined,
      0.15
    )
  ];
  const controls = Controls.addSlider(InitialDeltaX, -5, 5, 0.01, PrimeColor.raspberry, {
    label: '\\Delta x',
    animationStep: 0.01,
    valueFn: () => ''
  });
</script>

<Canvas2D
  {controls}
  {draggables}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={[
    ...getLegend(appletObjects),
    ...[
      new LegendItem('(a,f(a))', PrimeColor.orange),
      new LegendItem('(a+\\Delta x,f(a+\\Delta x))', PrimeColor.yellow),
      new LegendItem("(a+\\Delta x,f(a)+\\Delta x f'(a))", PrimeColor.purple)
    ]
  ]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    origin={draggables[0].position}
    direction={new Vector2(0, 1)}
    isDashed={true}
    color={PrimeColor.raspberry}
  />
  <InfiniteLine2D
    origin={new Vector2(
      draggables[0].position.x + controls[0],
      BaseFunction(draggables[0].position.x + controls[0])
    )}
    direction={new Vector2(0, 1)}
    isDashed={true}
    color={PrimeColor.raspberry}
  />
  <InfiniteLine2D
    origin={draggables[0].position}
    direction={new Vector2(1, 0)}
    isDashed={true}
    color={PrimeColor.orange}
  />
  <InfiniteLine2D
    origin={new Vector2(
      draggables[0].position.x + controls[0],
      BaseFunction(draggables[0].position.x + controls[0])
    )}
    direction={new Vector2(1, 0)}
    isDashed={true}
    color={PrimeColor.yellow}
  />
  <InfiniteLine2D
    origin={new Vector2(
      draggables[0].position.x + controls[0],
      BaseFunction(draggables[0].position.x) +
        controls[0] * BaseDerivative(draggables[0].position.x)
    )}
    direction={new Vector2(1, 0)}
    isDashed={true}
    color={PrimeColor.purple}
  />
  <InfiniteLine2D
    origin={draggables[0].position}
    direction={new Vector2(1, BaseDerivative(draggables[0].position.x))}
    color={PrimeColor.darkGreen}
    width={0.08}
  />
  <Point2D
    position={new Vector2(
      draggables[0].position.x + controls[0],
      BaseFunction(draggables[0].position.x + controls[0])
    )}
    color={PrimeColor.yellow}
    radius={0.12}
  />
  <Point2D
    position={new Vector2(
      draggables[0].position.x + controls[0],
      BaseFunction(draggables[0].position.x) +
        controls[0] * BaseDerivative(draggables[0].position.x)
    )}
    color={PrimeColor.purple}
    radius={0.12}
  />
  <Latex2D
    position={new Vector2(draggables[0].position.x + controls[0] / 2, -1)}
    latex="\Delta x"
    alignX="center"
    alignY="top"
    color={PrimeColor.raspberry}
  />
  <Vector2D
    origin={new Vector2(draggables[0].position.x + 0.1 * controls[0], -1)}
    direction={new Vector2(1, 0)}
    color={PrimeColor.raspberry}
    length={0.9 * controls[0]}
  />
  <Vector2D
    origin={new Vector2(draggables[0].position.x + 0.5 * controls[0], -1)}
    direction={new Vector2(-1, 0)}
    color={PrimeColor.raspberry}
    length={0.5 * controls[0]}
  />
  // Delta y
  <Latex2D
    position={new Vector2(
      draggables[0].position.x + controls[0] + (controls[0] > 0 ? 1.1 : -1.1),
      (BaseFunction(draggables[0].position.x) +
        BaseFunction(draggables[0].position.x + controls[0])) /
        2
    )}
    latex="\Delta y"
    alignX={controls[0] > 0 ? 'left' : 'right'}
    alignY="center"
    color={PrimeColor.yellow}
  />
  <Vector2D
    origin={new Vector2(
      draggables[0].position.x + controls[0] + (controls[0] > 0 ? 1 : -1),
      BaseFunction(draggables[0].position.x) +
        0.1 *
          (BaseFunction(draggables[0].position.x + controls[0]) -
            BaseFunction(draggables[0].position.x))
    )}
    direction={new Vector2(0, 1)}
    color={PrimeColor.yellow}
    length={0.9 *
      (BaseFunction(draggables[0].position.x + controls[0]) -
        BaseFunction(draggables[0].position.x))}
  />
  <Vector2D
    origin={new Vector2(
      draggables[0].position.x + controls[0] + (controls[0] > 0 ? 1 : -1),
      BaseFunction(draggables[0].position.x) +
        0.5 *
          (BaseFunction(draggables[0].position.x + controls[0]) -
            BaseFunction(draggables[0].position.x))
    )}
    direction={new Vector2(0, -1)}
    color={PrimeColor.yellow}
    length={0.5 *
      (BaseFunction(draggables[0].position.x + controls[0]) -
        BaseFunction(draggables[0].position.x))}
  />
  // Delta L
  <Latex2D
    position={new Vector2(
      draggables[0].position.x + controls[0] + (controls[0] > 0 ? 2.5 : -2.5),
      BaseFunction(draggables[0].position.x) +
        BaseDerivative(draggables[0].position.x) * controls[0] * 0.5
    )}
    latex="f'(a)\Delta x"
    alignX={controls[0] > 0 ? 'left' : 'right'}
    alignY="center"
    color={PrimeColor.purple}
  />
  <Vector2D
    origin={new Vector2(
      draggables[0].position.x + controls[0] + (controls[0] > 0 ? 2.4 : -2.4),
      BaseFunction(draggables[0].position.x) +
        0.1 * (BaseDerivative(draggables[0].position.x) * controls[0])
    )}
    direction={new Vector2(0, 1)}
    color={PrimeColor.purple}
    length={0.9 * (BaseDerivative(draggables[0].position.x) * controls[0])}
  />
  <Vector2D
    origin={new Vector2(
      draggables[0].position.x + controls[0] + (controls[0] > 0 ? 2.4 : -2.4),
      BaseFunction(draggables[0].position.x) +
        0.5 * (BaseDerivative(draggables[0].position.x) * controls[0])
    )}
    direction={new Vector2(0, -1)}
    color={PrimeColor.purple}
    length={0.5 * (BaseDerivative(draggables[0].position.x) * controls[0])}
  />
</Canvas2D>
