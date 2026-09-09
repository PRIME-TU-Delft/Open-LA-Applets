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
    new Vector2(-5, -5), // bottom-left
    new Vector2(5, 5), // top-right
    0.5 // margin
  );

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment(`\\frac{1}{x}`, PrimeColor.blue, { legendText: 'f(x)' })
  ];
</script>

<Canvas2D {initialViewBox} legendItems={getLegend(appletObjects)}>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
