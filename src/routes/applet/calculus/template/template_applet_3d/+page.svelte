<script lang="ts">
  // For ease of creating the template applets
  import {
    AngleObject3D,
    AppletObject3D,
    CuboidObject3D,
    InfiniteLineObject3D,
    LineSegmentObject3D,
    PointObject3D,
    PolygonObject3D,
    SurfaceFunction3D,
    TextObject3D,
    VectorFieldObject3D
  } from '$lib/template/TemplateAppletObjects3D';
  import TemplateComponent3D from '$lib/template/TemplateComponent3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { getLegend3D } from '$lib/template/ObjectFormulas';
  import Axis3D from '$lib/threlte/Axis3D.svelte';

  let showNumbers: boolean;
  let axisSpacing: number;
  let axisLength: number;
  let hideTicks: boolean;
  let floor: boolean;
  let hideOrigin: boolean;
  let cameraPosition: MathVector3 | undefined;
  let enablePan: boolean;
  let cameraZoom: number | undefined;
  let showAxes: boolean;

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
  cameraPosition = new MathVector3(10, 10, 10);
  cameraZoom = 29;
  enablePan = false;

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  showAxes = true;

  showNumbers = false;
  hideTicks = true;
  axisLength = 10;
  axisSpacing = 2;
  floor = false;
  hideOrigin = false;

  // ##############
  // APPLET OBJECTS
  // ##############

  const appletObjects: AppletObject3D[] = [
    new PointObject3D(new MathVector3(0, 0, 0), PrimeColor.red, {
      latex: '\\sigma',
      legendText: '\\sigma'
    }),
    new SurfaceFunction3D((x, y) => -Math.sqrt(x * x + y * y) + 3, PrimeColor.raspberry, {
      wireframe: true,
      shape: 'square',
      legendText: 'Surface'
    }),
    new AngleObject3D(
      new MathVector3(0, 0, 0),
      new MathVector3(1, 0, 0),
      new MathVector3(0, 0, 1),
      PrimeColor.blue,
      { latex: '\\theta', size: 9 }
    ),
    new TextObject3D('\\pi', new MathVector3(0, 6, 8), PrimeColor.darkGreen),
    new VectorFieldObject3D(
      (x: number, y: number) => new MathVector3(x, -y, 0),
      PrimeColor.darkBlue,
      {
        xRange: [-2, 2],
        yRange: [-2, 2],
        zRange: [-2, 2]
      }
    ),
    new LineSegmentObject3D(
      new MathVector3(0, 0, 0),
      new MathVector3(-8, -4, 3),
      PrimeColor.yellow,
      {
        isDashed: true,
        radius: 2,
        shape: 'triangle',
        legendText: 'f(x)'
      }
    ),
    new InfiniteLineObject3D(new MathVector3(0, 0, 5), new MathVector3(1, 0, 0), PrimeColor.green, {
      radius: 1
    }),
    new PolygonObject3D(
      [
        new MathVector3(4, 1, 5),
        new MathVector3(6, 1, 5),
        new MathVector3(7, 0, 6.5),
        new MathVector3(6, -1, 8),
        new MathVector3(4, -1, 8)
      ],
      PrimeColor.pink
    ),
    new CuboidObject3D(
      PrimeColor.purple,
      [new MathVector3(7, 6, 4), new MathVector3(8, 8, 3)],
      true
    )
  ];
</script>

<Canvas3D legendItems={getLegend3D(appletObjects)} {cameraPosition} {enablePan} {cameraZoom}>
  {#if showAxes}
    <Axis3D {showNumbers} {hideTicks} {axisLength} {axisSpacing} {floor} {hideOrigin} />
  {/if}
  <TemplateComponent3D objects={appletObjects} />
</Canvas3D>
