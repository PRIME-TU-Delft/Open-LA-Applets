<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, LineFragment, Point, Polygon } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';

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
  xAxisLabel = '';
  yAxisLabel = 'x';

  // ##############
  // APPLET OBJECTS
  // ##############
  const ceilingWidth = 3;
  const ceilingTop = 4;
  const ceilingThickness = 0.2;
  const straightPart = 0.3;
  const massWidth = 0.5;
  const springRadius = 0.25;
  const ZigZags = 8;
  const springThickness = 0.1;
  const ceilingStartLeft = new Vector2(-4, ceilingTop);
  const ceilingStartRight = new Vector2(1, ceilingTop);
  const startSpringLeft = new Vector2(ceilingWidth / 2, -ceilingThickness).add(ceilingStartLeft);
  const startSpringRight = new Vector2(ceilingWidth / 2, -ceilingThickness).add(ceilingStartRight);
  const startZigZagLeft = new Vector2(0, -straightPart).add(startSpringLeft);
  const startZigZagRight = new Vector2(0, -straightPart).add(startSpringRight);
  const endSpringLeft = new Vector2(startSpringLeft.x, massWidth / 2);
  const endSpringRight = new Vector2(startSpringRight.x, -3 + massWidth / 2);
  const endZigZagLeft = new Vector2(startSpringLeft.x, endSpringLeft.y + straightPart);
  const endZigZagRight = new Vector2(startSpringRight.x, endSpringRight.y + straightPart);
  let listZigZagLeft = [startSpringLeft, startZigZagLeft];
  let listZigZagRight = [startSpringRight, startZigZagRight];
  const jumpLeft = (startZigZagLeft.y - endZigZagLeft.y) / ZigZags;
  const jumpRight = (startZigZagRight.y - endZigZagRight.y) / ZigZags;
  const quarterJumpLeft = jumpLeft / 4;
  const quarterJumpRight = jumpRight / 4;
  for (let i = 0; i < ZigZags; i++) {
    listZigZagLeft.push(
      new Vector2(
        startZigZagLeft.x - springRadius,
        startZigZagLeft.y - quarterJumpLeft - i * jumpLeft
      )
    );
    listZigZagLeft.push(
      new Vector2(
        startZigZagLeft.x + springRadius,
        startZigZagLeft.y - quarterJumpLeft - (i + 0.5) * jumpLeft
      )
    );
    listZigZagRight.push(
      new Vector2(
        startZigZagRight.x - springRadius,
        startZigZagRight.y - quarterJumpRight - i * jumpRight
      )
    );
    listZigZagRight.push(
      new Vector2(
        startZigZagRight.x + springRadius,
        startZigZagRight.y - quarterJumpRight - (i + 0.5) * jumpRight
      )
    );
  }
  listZigZagLeft.push(endZigZagLeft);
  listZigZagRight.push(endZigZagRight);
  listZigZagLeft.push(endSpringLeft);
  listZigZagRight.push(endSpringRight);
  const appletObjects: AppletObject[] = [];
  listZigZagLeft.forEach((point, index) => {
    if (index > 0 && index < listZigZagLeft.length - 1) {
      appletObjects.push(
        new Point(point, PrimeColor.blue, { radius: (springThickness - 0.02) / 2 })
      );
    }
  });
  listZigZagRight.forEach((point, index) => {
    if (index > 0 && index < listZigZagRight.length - 1) {
      appletObjects.push(
        new Point(point, PrimeColor.blue, { radius: (springThickness - 0.02) / 2 })
      );
    }
  });
  appletObjects.push(
    new LineFragment(startSpringLeft, startZigZagLeft, PrimeColor.blue, { width: springThickness }),
    new LineFragment(startSpringRight, startZigZagRight, PrimeColor.blue, {
      width: springThickness
    })
  );
  for (let i = 2; i < 2 * ZigZags + 2; i += 2) {
    const start = listZigZagLeft.at(i);
    const end = listZigZagLeft.at(i + 1);
    if (start !== undefined && end !== undefined) {
      appletObjects.push(
        new LineFragment(start, end, PrimeColor.blue + PrimeColor.opacity(0.8), {
          width: springThickness
        })
      );
    }
    const startR = listZigZagRight.at(i);
    const endR = listZigZagRight.at(i + 1);
    if (startR !== undefined && endR !== undefined) {
      appletObjects.push(
        new LineFragment(startR, endR, PrimeColor.blue + PrimeColor.opacity(0.8), {
          width: springThickness
        })
      );
    }
  }
  for (let i = 1; i < 2 * ZigZags + 2; i += 2) {
    const start = listZigZagLeft.at(i);
    const end = listZigZagLeft.at(i + 1);
    if (start !== undefined && end !== undefined) {
      appletObjects.push(new LineFragment(start, end, PrimeColor.blue, { width: springThickness }));
    }
    const startR = listZigZagRight.at(i);
    const endR = listZigZagRight.at(i + 1);
    if (startR !== undefined && endR !== undefined) {
      appletObjects.push(
        new LineFragment(startR, endR, PrimeColor.blue, { width: springThickness })
      );
    }
  }
  const massLeft = [
    new Vector2(-massWidth / 2, 0).add(endSpringLeft),
    new Vector2(massWidth / 2, 0).add(endSpringLeft),
    new Vector2(massWidth / 2, -massWidth).add(endSpringLeft),
    new Vector2(-massWidth / 2, -massWidth).add(endSpringLeft)
  ];
  const massRight = [
    new Vector2(-massWidth / 2, 0).add(endSpringRight),
    new Vector2(massWidth / 2, 0).add(endSpringRight),
    new Vector2(massWidth / 2, -massWidth).add(endSpringRight),
    new Vector2(-massWidth / 2, -massWidth).add(endSpringRight)
  ];
  appletObjects.push(
    new LineFragment(endZigZagLeft, endSpringLeft, PrimeColor.blue, { width: springThickness }),
    new LineFragment(endZigZagRight, endSpringRight, PrimeColor.blue, { width: springThickness }),
    new Polygon(massLeft, PrimeColor.yellow + PrimeColor.opacity(0.7), { fillStyle: 'full' }),
    new Polygon(massRight, PrimeColor.yellow + PrimeColor.opacity(0.7), { fillStyle: 'full' }),
    new Polygon(massLeft, PrimeColor.yellow, { fillStyle: 'none' }),
    new Polygon(massRight, PrimeColor.yellow, { fillStyle: 'none' })
  );
  appletObjects.push(
    new Polygon(
      [
        ceilingStartLeft,
        new Vector2(ceilingWidth, 0).add(ceilingStartLeft),
        new Vector2(ceilingWidth, -ceilingThickness).add(ceilingStartLeft),
        new Vector2(0, -ceilingThickness).add(ceilingStartLeft)
      ],
      PrimeColor.black,
      { fillStyle: 'dashed' }
    ),
    new Polygon(
      [
        ceilingStartRight,
        new Vector2(ceilingWidth, 0).add(ceilingStartRight),
        new Vector2(ceilingWidth, -ceilingThickness).add(ceilingStartRight),
        new Vector2(0, -ceilingThickness).add(ceilingStartRight)
      ],
      PrimeColor.black,
      { fillStyle: 'dashed' }
    )
  );
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
</Canvas2D>
