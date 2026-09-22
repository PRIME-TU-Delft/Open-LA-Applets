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
    new Vector2(5, 4), // top-right
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
      { width: 1.2 }
    ),
    new Polygon([new Vector2(0, 0), new Vector2(4, 0), new Vector2(4, 3)], PrimeColor.blue, {
      width: 1.3
    })
  ];
</script>

<Canvas2D {initialViewBox} axis={null} {scaleX} {scaleY}>
  <Latex2D
    latex="a"
    position={new Vector2(2, 0)}
    alignX="center"
    alignY="top"
    background={PrimeColor.white}
    padding="0.75em"
  />
  <Latex2D
    latex="b"
    position={new Vector2(4.04, 1.5)}
    alignX="left"
    alignY="center"
    background={PrimeColor.white}
    padding="0.5em"
  />
  <Latex2D
    latex="c"
    position={new Vector2(2, 1.5)}
    alignX="center"
    alignY="bottom"
    background={PrimeColor.white}
    padding="0.55em"
    rotation={(Math.atan2(3, 4) * 180) / Math.PI}
    offset={new Vector2(-3, 4).normalize().multiplyScalar(0.05)}
  />
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
