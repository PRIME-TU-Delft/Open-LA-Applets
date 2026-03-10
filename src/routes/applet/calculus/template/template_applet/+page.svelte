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
  cameraPosition = new Vector2(3, 1);
  cameraZoom = 1.5;

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
    new FunctionFragment((x: number) => x ** 2 - 2, PrimeColor.raspberry, { xMin: -1, xMax: 2.14 }),
    new FunctionFragment('\\frac{{x+1}^2}{x+1}', PrimeColor.blue, { xMax: 3 }, false, 'square')
      .addGaps(new Vector2(-1, 0))
      .addIncludedPoints(new Vector2(3, 4))
      .withLegend('f(x)', FillType.Dashed),
    new FunctionFragment('e^x', PrimeColor.darkGreen)
      .withIntegral({
        xLeft: -4,
        xRight: -1.25,
        fillStyle: 'full'
      })
      .withLegend('g(x)'),
    new AsymptoteFragment(2, 'vertical', PrimeColor.cyan),
    new AsymptoteFragment(-1.5, 'horizontal', PrimeColor.black),
    new ObliqueAsymptoteFragment('x+2', PrimeColor.orange)
  ];
</script>

<Canvas2D {initialViewBox} {cameraPosition} {cameraZoom} legendItems={getLegend(appletObjects)}>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
