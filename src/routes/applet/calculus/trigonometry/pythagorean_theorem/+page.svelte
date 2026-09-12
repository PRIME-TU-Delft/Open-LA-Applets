<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, Polygon } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
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
    new Vector2(-1, -1), // bottom-left
    new Vector2(5, 8), // top-right
    0.5 // margin
  );

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

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new Polygon(
      [new Vector2(3.7, 0), new Vector2(4, 0), new Vector2(4, 0.3), new Vector2(3.7, 0.3)],
      PrimeColor.black,
      { width: 1.1 }
    ),
    new Polygon(
      [new Vector2(3.7, 7), new Vector2(4, 7), new Vector2(4, 6.7), new Vector2(3.7, 6.7)],
      PrimeColor.black,
      { width: 1.1 }
    ),
    new Polygon(
      [new Vector2(-2.7, 7), new Vector2(-3, 7), new Vector2(-3, 6.7), new Vector2(-2.7, 6.7)],
      PrimeColor.black,
      { width: 1.1 }
    ),
    new Polygon(
      [new Vector2(-2.7, 0), new Vector2(-3, 0), new Vector2(-3, 0.3), new Vector2(-2.7, 0.3)],
      PrimeColor.black,
      { width: 1.1 }
    ),
    new Polygon([new Vector2(0, 0), new Vector2(4, 0), new Vector2(4, 3)], PrimeColor.blue, {
      width: 1.3
    }),
    new Polygon([new Vector2(4, 3), new Vector2(4, 7), new Vector2(1, 7)], PrimeColor.pink, {
      width: 1.3
    }),
    new Polygon([new Vector2(1, 7), new Vector2(-3, 7), new Vector2(-3, 4)], PrimeColor.green, {
      width: 1.3
    }),
    new Polygon([new Vector2(-3, 4), new Vector2(-3, 0), new Vector2(0, 0)], PrimeColor.orange, {
      width: 1.3
    })
  ];
</script>

<Canvas2D {initialViewBox} axis={null} {scaleX} {scaleY}>
  <TemplateComponent objects={appletObjects} />
  <Latex2D
    latex="a"
    position={new Vector2(2, -0.15)}
    alignX="center"
    alignY="top"
    color={PrimeColor.blue}
  />
  <Latex2D
    latex="b"
    position={new Vector2(4.15, 1.5)}
    alignX="left"
    alignY="center"
    color={PrimeColor.blue}
  />
  <Latex2D
    latex="c"
    position={new Vector2(2.1, 1.6)}
    alignX="right"
    alignY="bottom"
    color={PrimeColor.blue}
  />
  <Latex2D
    latex="a"
    position={new Vector2(4.15, 5)}
    alignX="left"
    alignY="center"
    color={PrimeColor.pink}
  />
  <Latex2D
    latex="b"
    position={new Vector2(2.5, 7.15)}
    alignX="center"
    alignY="bottom"
    color={PrimeColor.pink}
  />
  <Latex2D
    latex="c"
    position={new Vector2(2.4, 4.9)}
    alignX="right"
    alignY="top"
    color={PrimeColor.pink}
  />
  <Latex2D
    latex="a"
    position={new Vector2(-1, 7.15)}
    alignX="center"
    alignY="bottom"
    color={PrimeColor.green}
  />
  <Latex2D
    latex="b"
    position={new Vector2(-3.15, 5.5)}
    alignX="right"
    alignY="center"
    color={PrimeColor.green}
  />
  <Latex2D
    latex="c"
    position={new Vector2(-0.9, 5.4)}
    alignX="left"
    alignY="top"
    color={PrimeColor.green}
  />
  <Latex2D
    latex="a"
    position={new Vector2(-3.15, 2)}
    alignX="right"
    alignY="center"
    color={PrimeColor.orange}
  />
  <Latex2D
    latex="b"
    position={new Vector2(-1.5, -0.15)}
    alignX="center"
    alignY="top"
    color={PrimeColor.orange}
  />
  <Latex2D
    latex="c"
    position={new Vector2(-1.4, 2.1)}
    alignX="left"
    alignY="bottom"
    color={PrimeColor.orange}
  />
</Canvas2D>
