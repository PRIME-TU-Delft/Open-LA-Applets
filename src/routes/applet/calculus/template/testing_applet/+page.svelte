<script lang="ts">
  // For ease of creating the template applets
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import {
    AppletObject,
    AsymptoteFragment,
    FunctionFragment,
    ObliqueAsymptoteFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import Vector2D from '$lib/d3/Vector2D.svelte';

  let initialViewBox: ViewBox | undefined;

  // ###############
  // CAMERA SETTINGS
  // ###############

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-3, -4), // bottom-left
    new Vector2(4, 7), // top-right
    0.5 // margin
  );

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    // Wrong jump
    new FunctionFragment(
      (x: number) => (x < 0 ? -1 * x ** 2 + 4 : x <= 2 ? 2 : NaN),
      PrimeColor.raspberry
    ),
    // Correct jump
    new FunctionFragment(
      (x: number) => (0.5 * x < 0 ? -1 * (0.5 * x) ** 2 + 7 : NaN),
      PrimeColor.darkGreen
    ).addGaps(new Vector2(0, 7)),
    new FunctionFragment(
      (x: number) => (0.5 * x >= 0 && 0.5 * x <= 2 ? 5 : NaN),
      PrimeColor.darkGreen
    ).addIncludedPoints(new Vector2(0, 5))
  ];
</script>

<Canvas2D {initialViewBox}>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
