<script lang="ts">
  // For ease of creating the template applets

  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
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

<Canvas2D {initialViewBox} legendItems={getLegend(appletObjects)}>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
