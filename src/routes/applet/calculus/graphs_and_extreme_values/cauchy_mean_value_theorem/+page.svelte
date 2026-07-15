<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    ParameterizedFunctionFragment,
    Point,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';

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
  cameraPosition = new Vector2(4.5, 2);
  cameraZoom = 1.5;

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
  function FunctionX(t: number): number {
    if (t <= 1) {
      const u = t;
      return 1 + (391 / 390) * u;
    }
    if (t <= 2) {
      const u = t - 1;
      return 2 + (388 / 390) * u - (1 / 130) * u * u + (1 / 78) * u * u * u;
    }
    if (t <= 3) {
      const u = t - 2;
      return 3 + (397 / 390) * u + (2 / 65) * u * u - (19 / 390) * u * u * u;
    }
    if (t <= 4) {
      const u = t - 3;
      return 4 + (14 / 15) * u - (3 / 26) * u * u + (71 / 390) * u * u * u;
    }
    if (t <= 5) {
      const u = t - 4;
      return 5 + (487 / 390) * u + (28 / 65) * u * u - (265 / 390) * u * u * u;
    }

    const u = t - 5;
    return 6 + (28 / 390) * u - (209 / 130) * u * u + (209 / 390) * u * u * u;
  }

  function FunctionY(t: number): number {
    if (t <= 1) {
      const u = t;
      return 1 + (219 / 130) * u - (12 / 65) * u * u * u;
    }
    if (t <= 2) {
      const u = t - 1;
      return 2.5 + (147 / 130) * u - (36 / 65) * u * u - (1 / 13) * u * u * u;
    }
    if (t <= 3) {
      const u = t - 2;
      return 3 - (27 / 130) * u - (51 / 65) * u * u - (1 / 130) * u * u * u;
    }
    if (t <= 4) {
      const u = t - 3;
      return 2 - (9 / 5) * u - (21 / 26) * u * u + (72 / 65) * u * u * u;
    }
    if (t <= 5) {
      const u = t - 4;
      return 0.5 - (6 / 65) * u + (327 / 130) * u * u - (12 / 13) * u * u * u;
    }

    const u = t - 5;
    return 2 + (282 / 130) * u - (33 / 130) * u * u + (11 / 130) * u * u * u;
  }

  function LinearFunction(x: number): number {
    const slope = (FunctionY(6) - FunctionY(0)) / (FunctionX(6) - FunctionX(0));
    return slope * (x - FunctionX(0)) + FunctionY(0);
  }

  const t1 = (5 * Math.sqrt(477) - 53) / 38;
  const x1 = FunctionX(t1);
  const y1 = FunctionY(t1);
  const t2 = (1426 - 3 * Math.sqrt(40883)) / 197;
  const x2 = FunctionX(t2);
  const y2 = FunctionY(t2);

  const appletObjects: AppletObject[] = [
    new ParameterizedFunctionFragment(FunctionX, FunctionY, PrimeColor.blue, {
      tStart: 0,
      tEnd: 6,
      width: 0.08
    }),
    new Point(new Vector2(FunctionX(0), FunctionY(0)), PrimeColor.cyan, {
      legendText: '(f(a),g(a))',
      radius: 0.08
    }),
    new Point(new Vector2(FunctionX(6), FunctionY(6)), PrimeColor.pink, {
      legendText: '(f(b),g(b))',
      radius: 0.08,
      shape: 'square'
    }),
    new Point(new Vector2(x1, y1), PrimeColor.green, {
      legendText: '(f(c),g(c))',
      radius: 0.08,
      shape: 'diamond'
    }),
    new Point(new Vector2(x2, y2), PrimeColor.yellow, {
      legendText: '(f(d),g(d))',
      radius: 0.08,
      shape: 'triangle'
    }),
    new Text(
      '\\begin{pmatrix}f(b)-f(a)\\\\g(b)-g(a)\\end{pmatrix}',
      new Vector2(FunctionX(6), FunctionY(6)),
      PrimeColor.raspberry,
      {
        alignX: 'right',
        alignY: 'bottom'
      }
    ),
    new Text(
      "\\begin{pmatrix}f'(c)\\\\g'(c)\\end{pmatrix}",
      new Vector2(x1 + 0.5, y1 + 0.6),
      PrimeColor.green,
      {
        alignX: 'center',
        alignY: 'bottom'
      }
    ),
    new Text(
      "\\begin{pmatrix}f'(d)\\\\g'(d)\\end{pmatrix}",
      new Vector2(x2 + 0.8, y2 + 0.5),
      PrimeColor.yellow,
      {
        alignX: 'left',
        alignY: 'bottom'
      }
    )
  ];
</script>

<Canvas2D
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <Vector2D
    origin={new Vector2(FunctionX(0), FunctionY(0))}
    direction={new Vector2(FunctionX(6) - FunctionX(0), FunctionY(6) - FunctionY(0))}
    length={Math.sqrt(
      Math.pow(FunctionX(6) - FunctionX(0), 2) + Math.pow(FunctionY(6) - FunctionY(0), 2)
    )}
    color={PrimeColor.raspberry}
  />
  <TemplateComponent objects={appletObjects} />

  <Vector2D
    origin={new Vector2(x1, y1)}
    direction={new Vector2(FunctionX(6) - FunctionX(0), FunctionY(6) - FunctionY(0))}
    length={1}
    color={PrimeColor.green}
  />
  <Vector2D
    origin={new Vector2(x2, y2)}
    direction={new Vector2(FunctionX(6) - FunctionX(0), FunctionY(6) - FunctionY(0))}
    length={1}
    color={PrimeColor.yellow}
  />
</Canvas2D>
