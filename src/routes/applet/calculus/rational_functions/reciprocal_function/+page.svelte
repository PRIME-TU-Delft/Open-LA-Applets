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
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { FillType } from '$lib/utils/Legend';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;

  // ###############
  // CAMERA SETTINGS
  // ###############

  // (remove if unnecessary)
  cameraPosition = new Vector2(0, 0);
  cameraZoom = 1.5;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-5, -5), // bottom-left
    new Vector2(5, 5), // top-right
    0.5 // margin
  );

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment(`\\frac{1}{x}`, PrimeColor.blue)
      .withLegend('f(x)'),
  ];
</script>

<Canvas2D {initialViewBox} {cameraPosition} {cameraZoom} legendItems={getLegend(appletObjects)}>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
