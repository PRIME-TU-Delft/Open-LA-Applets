<script lang="ts">
  // For ease of creating the template applets

  import {
    AppletObject,
    AsymptoteFragment,
    FunctionFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';

  let initialViewBox: ViewBox | undefined;

  // ###############
  // CAMERA SETTINGS
  // ###############
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
    new FunctionFragment(`\\frac{2x^2+7x-15}{2x^2-x-3}`, PrimeColor.blue, {
      legendText: 'f(x)'
    }).addGaps(new Vector2(1.5, 2.6)),
    new AsymptoteFragment(-1, 'vertical', PrimeColor.blue),
    new AsymptoteFragment(1, 'horizontal', PrimeColor.blue)
  ];
</script>

<Canvas2D {initialViewBox} legendItems={getLegend(appletObjects)}>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
