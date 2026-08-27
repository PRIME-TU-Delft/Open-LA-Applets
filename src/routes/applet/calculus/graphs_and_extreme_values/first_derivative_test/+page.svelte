<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Text } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';

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

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

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

  const a = 1;
  const b = 4;
  const c = 2.4;
  const A = 1;
  const B = 3;

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  function Function1(x: number): number {
    return (x - c) ** 2 + A;
  }
  function Function2(x: number): number {
    return -1 * (x - c) ** 2 + B;
  }
  function Function3(x: number): number {
    return 0.5 * (x - c) ** 3 + (B + A) / 2;
  }
  function Function4(x: number): number {
    return -0.5 * (x - c) ** 3 + (B + A) / 2 + A / 2;
  }
  function Derivative1(x: number): number {
    return 2 * (x - c);
  }
  function Derivative2(x: number): number {
    return -2 * (x - c);
  }
  function Derivative3(x: number): number {
    return 1.5 * (x - c) ** 2;
  }
  function Derivative4(x: number): number {
    return -1.5 * (x - c) ** 2;
  }
  const appletObjectsShared: AppletObject[] = [
    new Text('\\LARGE a', new Vector2(a, -0.1), PrimeColor.grey, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('\\LARGE b', new Vector2(b, -0.1), PrimeColor.grey, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('\\LARGE c', new Vector2(c, -0.1), PrimeColor.grey, {
      alignX: 'center',
      alignY: 'top'
    })
  ];
  const appletObjects1: AppletObject[] = [
    new FunctionFragment((x: number) => Function1(x), PrimeColor.blue, {
      width: 0.08,
      domain: { xMin: a, xMax: b }
    }).addIncludedPoints(
      [new Vector2(a, Function1(a)), new Vector2(b, Function1(b))],
      undefined,
      0.1
    )
  ];
  const appletObjects2: AppletObject[] = [
    new FunctionFragment((x: number) => Function2(x), PrimeColor.raspberry, {
      width: 0.08,
      domain: { xMin: a, xMax: b }
    }).addIncludedPoints(
      [new Vector2(a, Function2(a)), new Vector2(b, Function2(b))],
      undefined,
      0.1
    )
  ];
  const appletObjects3: AppletObject[] = [
    new FunctionFragment((x: number) => Function3(x), PrimeColor.darkGreen, {
      width: 0.08,
      domain: { xMin: a, xMax: b }
    }).addIncludedPoints(
      [new Vector2(a, Function3(a)), new Vector2(b, Function3(b))],
      undefined,
      0.1
    )
  ];
  const appletObjects4: AppletObject[] = [
    new FunctionFragment((x: number) => Function4(x), PrimeColor.purple, {
      domain: { xMin: a, xMax: b },
      width: 0.08
    }).addIncludedPoints(
      [new Vector2(a, Function4(a)), new Vector2(b, Function4(b))],
      undefined,
      0.1
    )
  ];

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  cameraPosition = new Vector2(2.5, 1.5);
  cameraZoom = 1.7;

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: -1,
    additionalTicksX: [a, b, c]
  };

  const draggablePoint = [
    new Draggable(
      new Vector2((a + c) / 2, Function1((a + c) / 2)),
      PrimeColor.orange,
      undefined,
      snapToFunc1,
      undefined,
      undefined,
      0.12
    ),
    new Draggable(
      new Vector2((a + c) / 2, Function2((a + c) / 2)),
      PrimeColor.yellow,
      undefined,
      snapToFunc2,
      undefined,
      undefined,
      0.12
    ),
    new Draggable(
      new Vector2((a + c) / 2, Function3((a + c) / 2)),
      PrimeColor.pink,
      undefined,
      snapToFunc3,
      undefined,
      undefined,
      0.12
    ),
    new Draggable(
      new Vector2((a + c) / 2, Function4((a + c) / 2)),
      PrimeColor.cyan,
      undefined,
      snapToFunc4,
      undefined,
      undefined,
      0.12
    )
  ];

  function snapToFunc1(pos: Vector2): Vector2 {
    const x = Math.max(a, Math.min(b, pos.x));
    return new Vector2(x, Function1(x));
  }
  function snapToFunc2(pos: Vector2): Vector2 {
    const x = Math.max(a, Math.min(b, pos.x));
    return new Vector2(x, Function2(x));
  }
  function snapToFunc3(pos: Vector2): Vector2 {
    const x = Math.max(a, Math.min(b, pos.x));
    return new Vector2(x, Function3(x));
  }
  function snapToFunc4(pos: Vector2): Vector2 {
    const x = Math.max(a, Math.min(b, pos.x));
    return new Vector2(x, Function4(x));
  }
  const DeltaX = 0.5;
</script>

<CanvasGrid rows={2} columns={2}>
  <GridCanvas2D
    draggables={[draggablePoint[0]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects1} />
    <TemplateComponent objects={appletObjectsShared} />
    <Line2D
      start={new Vector2(
        draggablePoint[0].position.x - DeltaX,
        Function1(draggablePoint[0].position.x) +
          Derivative1(draggablePoint[0].position.x) * -DeltaX
      )}
      end={new Vector2(
        draggablePoint[0].position.x + DeltaX,
        Function1(draggablePoint[0].position.x) + Derivative1(draggablePoint[0].position.x) * DeltaX
      )}
      color={PrimeColor.orange}
      width={0.06}
    />
  </GridCanvas2D>

  <GridCanvas2D
    draggables={[draggablePoint[1]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects2} />
    <TemplateComponent objects={appletObjectsShared} />
    <Line2D
      start={new Vector2(
        draggablePoint[1].position.x - DeltaX,
        Function2(draggablePoint[1].position.x) +
          Derivative2(draggablePoint[1].position.x) * -DeltaX
      )}
      end={new Vector2(
        draggablePoint[1].position.x + DeltaX,
        Function2(draggablePoint[1].position.x) + Derivative2(draggablePoint[1].position.x) * DeltaX
      )}
      color={PrimeColor.yellow}
      width={0.06}
    />
  </GridCanvas2D>

  <GridCanvas2D
    draggables={[draggablePoint[2]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects3} />
    <TemplateComponent objects={appletObjectsShared} />
    <Line2D
      start={new Vector2(
        draggablePoint[2].position.x - DeltaX,
        Function3(draggablePoint[2].position.x) +
          Derivative3(draggablePoint[2].position.x) * -DeltaX
      )}
      end={new Vector2(
        draggablePoint[2].position.x + DeltaX,
        Function3(draggablePoint[2].position.x) + Derivative3(draggablePoint[2].position.x) * DeltaX
      )}
      color={PrimeColor.pink}
      width={0.06}
    />
  </GridCanvas2D>

  <GridCanvas2D
    draggables={[draggablePoint[3]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects4} />
    <TemplateComponent objects={appletObjectsShared} />
    <Line2D
      start={new Vector2(
        draggablePoint[3].position.x - DeltaX,
        Function4(draggablePoint[3].position.x) +
          Derivative4(draggablePoint[3].position.x) * -DeltaX
      )}
      end={new Vector2(
        draggablePoint[3].position.x + DeltaX,
        Function4(draggablePoint[3].position.x) + Derivative4(draggablePoint[3].position.x) * DeltaX
      )}
      color={PrimeColor.cyan}
      width={0.06}
    />
  </GridCanvas2D>
</CanvasGrid>
