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
    new Vector2(-5, -1), // bottom-left
    new Vector2(5, 1), // top-right
    0.5 // margin
  );

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment(`\\frac{8 (0.5)^3}{x^2+4(0.5)^2}`, PrimeColor.blue, { legendText: 'f(x)' })
  ];
</script>

<Canvas2D {initialViewBox} {cameraPosition} {cameraZoom} legendItems={getLegend(appletObjects)}>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
