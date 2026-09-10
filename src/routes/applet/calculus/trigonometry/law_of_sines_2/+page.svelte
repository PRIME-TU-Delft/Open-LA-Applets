<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, LineFragment, Polygon, Circle } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';

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
      undefined,
      undefined,
      undefined,
      0.12
    ),
    new Draggable(
      new Vector2(-radius * Math.cos(angleB), -radius * Math.sin(angleB)),
      PrimeColor.green,
      undefined,
      undefined,
      undefined,
      undefined,
      0.12
    ),
    new Draggable(
      new Vector2(0.8 + radius * Math.cos(angleC), radius * Math.sin(angleC)),
      PrimeColor.blue,
      undefined,
      undefined,
      undefined,
      undefined,
      0.12
    )
  ];
  const B = $derived(draggables[0].position.clone());
  const A = $derived(draggables[1].position.clone());
  const C = $derived(draggables[2].position.clone());

  const BC = $derived(C.clone().sub(B));
  const CA = $derived(A.clone().sub(C));
  const AB = $derived(B.clone().sub(A));
  const inCenter = $derived.by(() => {
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
  const E = $derived.by(() => {
    const dot = CA.dot(AB);
    const lengthSquared = AB.lengthSq();
    const t = dot / lengthSquared;
    return A.clone().add(AB.clone().multiplyScalar(-t));
  });
  const circumCenter = $derived.by(() => {
    let D = A.x * (B.y - C.y);
    D += B.x * (C.y - A.y);
    D += C.x * (A.y - B.y);
    D *= 2;
    if (D === 0) {
      return undefined;
    }
    const SA = A.lengthSq();
    const SB = B.lengthSq();
    const SC = C.lengthSq();
    let Ox = (SA / D) * (B.y - C.y);
    Ox += (SB / D) * (C.y - A.y);
    Ox += (SC / D) * (A.y - B.y);
    let Oy = (SA / D) * (C.x - B.x);
    Oy += (SB / D) * (A.x - C.x);
    Oy += (SC / D) * (B.x - A.x);
    return new Vector2(Ox, Oy);
  });
  const AI = $derived(inCenter.clone().sub(draggables[1].position).normalize());
  const BI = $derived(inCenter.clone().sub(draggables[0].position).normalize());
  const AE = $derived(E.clone().sub(A));
  const CE = $derived(E.clone().sub(C));
  const circumRadius = $derived(circumCenter?.clone().sub(A).length());

  const angleOffset = 0.75;
  const rightAngleSize = 0.3;
  const appletObjects: AppletObject[] = $derived.by(() => {
    let listOfObjects = [];
    if (circumCenter != undefined && circumRadius != undefined) {
      listOfObjects.push(new Circle(circumCenter, circumRadius, PrimeColor.black));
    }
    listOfObjects.push(
      new Polygon(
        [
          E,
          E.clone().sub(AE.clone().normalize().multiplyScalar(rightAngleSize)),
          E.clone()
            .sub(AE.clone().normalize().multiplyScalar(rightAngleSize))
            .sub(CE.clone().normalize().multiplyScalar(rightAngleSize)),
          E.clone().sub(CE.clone().normalize().multiplyScalar(rightAngleSize))
        ],
        PrimeColor.black,
        { width: 1.2 }
      ),
      new LineFragment(A, B, PrimeColor.blue, {
        width: 0.08
      }),
      new LineFragment(A, C, PrimeColor.orange, {
        width: 0.08
      }),
      new LineFragment(C, B, PrimeColor.green, {
        width: 0.08
      }),
      new LineFragment(C, E, PrimeColor.yellow, {
        width: 0.08
      })
    );
    return listOfObjects;
  });
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
    color={PrimeColor.green}
  />
  <Latex2D
    latex="C"
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.8)}
    position={draggables[2].position}
    extend={0.5}
    color={PrimeColor.blue}
  />
  <Latex2D
    latex="\alpha"
    alignX="center"
    alignY="center"
    offset={AI.clone().multiplyScalar(angleOffset)}
    color={PrimeColor.green}
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
  <Latex2D
    latex="a"
    alignX="center"
    alignY="center"
    offset={new Vector2(-BC.y, BC.x).normalize().multiplyScalar(-0.25)}
    color={PrimeColor.green}
    position={B.clone().add(BC.clone().multiplyScalar(0.5))}
  />
  <Latex2D
    latex="b"
    alignX="center"
    alignY="center"
    offset={new Vector2(-CA.y, CA.x).normalize().multiplyScalar(-0.25)}
    color={PrimeColor.orange}
    position={C.clone().add(CA.clone().multiplyScalar(0.5))}
  />
  <Latex2D
    latex="c"
    alignX="center"
    alignY="center"
    offset={new Vector2(-AB.y, AB.x).normalize().multiplyScalar(-0.25)}
    color={PrimeColor.blue}
    position={A.clone().add(AB.clone().multiplyScalar(0.5))}
  />
  <Latex2D
    latex="h"
    alignX="center"
    alignY="center"
    offset={new Vector2(-CE.y, CE.x).normalize().multiplyScalar(-0.25)}
    color={PrimeColor.yellow}
    position={C.clone().add(CE.clone().multiplyScalar(0.5))}
  />
  <Point2D position={E} />
</Canvas2D>
