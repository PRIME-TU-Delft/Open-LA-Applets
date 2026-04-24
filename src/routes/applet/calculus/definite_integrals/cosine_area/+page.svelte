<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */ // For ease of creating the template applets
  import {
    AppletObject,
    AsymptoteFragment,
    FunctionFragment,
    ObliqueAsymptoteFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Axis from '$lib/d3/Axis.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Latex from '$lib/components/Latex.svelte';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;

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
  cameraPosition = new Vector2(3, 1);
  cameraZoom = 1.5;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-2, -4), // bottom-left
    new Vector2(11, 6), // top-right
    0.5 // margin
  );

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  let sX = 1.5;
  let sY = 3;

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment(sY + '\\cos(x/' + sX + ')', PrimeColor.blue, {
      domain: { xMin: 0, xMax: 2 * Math.PI * sX },
      integral: {
        xLeft: 0,
        xRight: 2 * Math.PI * sX,
        legendText: '\\int_{0}^{2\\pi} \\cos(x) dx',
        isDashed: false,
        color: PrimeColor.darkGreen,
        shape: 'square'
      }
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  position="top-right"
  axis={null}
>
  <TemplateComponent objects={appletObjects} />
  <Axis
    scaleX={sX}
    skipX={100}
    scaleY={sY}
    skipY={2}
    showAxisNumbersX={false}
    additionalTicksX={[0.5 * Math.PI * sX, Math.PI * sX, 1.5 * Math.PI * sX, 2 * Math.PI * sX]}
  />
  <Latex2D
    latex={'\\frac12\\pi'}
    position={new Vector2(0.5 * Math.PI * sX, -0.15)}
    alignX="right"
  />
  <Latex2D
    latex={'\\pi'}
    position={new Vector2(Math.PI * sX, 0.15)}
    alignX="center"
    alignY="bottom"
  />
  <Latex2D latex={'\\frac32\\pi'} position={new Vector2(1.5 * Math.PI * sX, -0.15)} alignX="left" />
  <Latex2D latex={'2\\pi'} position={new Vector2(2 * Math.PI * sX, -0.15)} alignX="center" />
</Canvas2D>
