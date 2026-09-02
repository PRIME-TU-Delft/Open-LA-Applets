<script lang="ts">
  // For ease of creating the template applets
  import {
    Angle3,
    AppletObject3D,
    InfiniteLine3,
    LineSegment3,
    Point3,
    Polygon3,
    Surface3,
    Text3,
    VectorField3
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
    new Point3(new MathVector3(0, 0, 0), PrimeColor.red, {
      latex: '\\sigma',
      legendText: '\\sigma'
    }),
    new Surface3((x, y) => -Math.sqrt(x * x + y * y) + 5, PrimeColor.raspberry, {
      wireframe: true,
      shape: 'square',
      legendText: 'Surface'
    }),
    new Angle3(
      new MathVector3(0, 0, 0),
      new MathVector3(1, 0, 0),
      new MathVector3(0, 0, 1),
      PrimeColor.blue,
      { latex: '\\theta', size: 5 }
    ),
    new Text3('\\pi', new MathVector3(0, 6, 8), PrimeColor.darkGreen),
    new VectorField3((x: number, y: number) => new MathVector3(x, -y, 0), PrimeColor.darkBlue, {
      xRange: [-2, 2],
      yRange: [-2, 2],
      zRange: [-2, 2]
    }),
    new LineSegment3(new MathVector3(0, 0, 0), new MathVector3(-8, -4, 3), PrimeColor.yellow, {
      isDashed: true,
      radius: 2
    }),
    new InfiniteLine3(new MathVector3(0, 0, 5), new MathVector3(1, 0, 0), PrimeColor.green, {
      radius: 1
    }),
    new Polygon3(
      [
        new MathVector3(1, 1, 0),
        new MathVector3(3, 1, 0),
        new MathVector3(4, 0, 1.5),
        new MathVector3(3, -1, 3),
        new MathVector3(1, -1, 3)
      ],
      PrimeColor.pink
    )
  ];
</script>

<Canvas3D legendItems={getLegend3D(appletObjects)} {cameraPosition} {enablePan} {cameraZoom}>
  {#if showAxes}
    <Axis3D {showNumbers} {hideTicks} {axisLength} {axisSpacing} {floor} {hideOrigin} />
  {/if}
  <TemplateComponent3D objects={appletObjects} />
</Canvas3D>
