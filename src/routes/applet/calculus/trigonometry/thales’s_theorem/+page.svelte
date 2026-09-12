<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    Circle,
    LineFragment,
    Point,
    Polygon
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';

  let initialViewBox: ViewBox | undefined;

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
    new Vector2(-4, -4), // bottom-left
    new Vector2(4, 4), // top-right
    0 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

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
  // ##############
  // APPLET OBJECTS
  // ##############
  const radius = 3;
  const angleB = (10 / 180) * Math.PI;
  const angleC = (80 / 180) * Math.PI;
  const draggables = [
    new Draggable(
      new Vector2(radius * Math.cos(angleB), radius * Math.sin(angleB)),
      PrimeColor.orange,
      undefined,
      SnapToCircleB,
      undefined,
      undefined,
      0.12
    ),
    new Draggable(
      new Vector2(-radius * Math.cos(angleB), -radius * Math.sin(angleB)),
      PrimeColor.red,
      undefined,
      SnapToCircleA,
      undefined,
      undefined,
      0.12
    ),
    new Draggable(
      new Vector2(radius * Math.cos(angleC), radius * Math.sin(angleC)),
      PrimeColor.pink,
      undefined,
      SnapToCircleC,
      undefined,
      undefined,
      0.12
    )
  ];
  function SnapToCircleB(pos: Vector2): Vector2 {
    const angle = Math.atan2(pos.y, pos.x);
    // force other draggable too
    draggables[1].value = new Vector2(-radius * Math.cos(angle), -radius * Math.sin(angle));
    return new Vector2(radius * Math.cos(angle), radius * Math.sin(angle));
  }
  function SnapToCircleA(pos: Vector2): Vector2 {
    const angle = Math.atan2(pos.y, pos.x);
    // force other draggable too
    draggables[0].value = new Vector2(-radius * Math.cos(angle), -radius * Math.sin(angle));
    return new Vector2(radius * Math.cos(angle), radius * Math.sin(angle));
  }
  function SnapToCircleC(pos: Vector2): Vector2 {
    const angle = Math.atan2(pos.y, pos.x);
    return new Vector2(radius * Math.cos(angle), radius * Math.sin(angle));
  }
  const appletObjects: AppletObject[] = $derived.by(() => {
    return [
      new Circle(new Vector2(0, 0), radius, PrimeColor.blue, { width: 0.08 }),
      new LineFragment(new Vector2(0, 0), draggables[2].position, PrimeColor.cyan, {
        width: 0.08,
        isDashed: true
      }),
      new Polygon(
        [draggables[0].position, draggables[1].position, draggables[2].position],
        PrimeColor.cyan,
        { width: 1.5 }
      ),
      new Point(new Vector2(0, 0), PrimeColor.green)
    ];
  });

  const currentAngle = $derived(Math.atan2(draggables[0].position.y, draggables[0].position.x));
  const inCenter = $derived.by(() => {
    const B = draggables[0].position.clone();
    const A = draggables[1].position.clone();
    const C = draggables[2].position.clone();
    const BC = C.clone().sub(B);
    const CA = A.clone().sub(C);
    const AB = B.clone().sub(A);
    const a = BC.length();
    const b = CA.length();
    const c = AB.length();
    const d = a + b + c;
    const wA = a / d;
    const wB = b / d;
    const wC = c / d;
    const Ix = wA * A.x + wB * B.x + wC * C.x;
    const Iy = wA * A.y + wB * B.y + wC * C.y;
    const I = new Vector2(Ix, Iy);
    return I;
  });
  const AI = $derived(inCenter.clone().sub(draggables[1].position).normalize());
  const BI = $derived(inCenter.clone().sub(draggables[0].position).normalize());

  const angleOffset = 0.75;
</script>

<Canvas2D {draggables} {initialViewBox} axis={null} {scaleX} {scaleY}>
  <TemplateComponent objects={appletObjects} />
  <Latex2D
    latex="B"
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.8)}
    position={draggables[0].position}
    extend={0.5}
    color={PrimeColor.orange}
  />
  <Latex2D
    latex="A"
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.8)}
    position={draggables[1].position}
    extend={0.5}
    color={PrimeColor.red}
  />
  <Latex2D
    latex="C"
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.8)}
    position={draggables[2].position}
    extend={0.5}
    color={PrimeColor.pink}
  />
  <Latex2D
    latex="M"
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.8)}
    offset={new Vector2(Math.sin(currentAngle), -Math.cos(currentAngle)).multiplyScalar(0.5)}
    color={PrimeColor.green}
  />
  <Latex2D
    latex="\alpha"
    alignX="center"
    alignY="center"
    offset={AI.clone().multiplyScalar(angleOffset)}
    color={PrimeColor.red}
    position={draggables[1].position}
  />
  <Latex2D
    latex="\beta"
    alignX="center"
    alignY="center"
    offset={BI.clone().multiplyScalar(angleOffset)}
    color={PrimeColor.orange}
    position={draggables[0].position}
  />
</Canvas2D>
