<script lang="ts" module>
  export type MassSpring2DProps = {
    center?: number; // center of the spring and mass in the horizontal direction (pre-rotation)
    ceilingColor?: string; // color of the ceiling
    ceilingWidth?: number; // width of the ceiling
    ceilingTop?: number; // vertical position of the top of the ceiling (pre-rotation)
    ceilingThickness?: number; // thickness of the ceiling
    springStraightPart?: number; // length of the straight part of the spring at the top and bottom
    springRadius?: number; // radius of the zig-zag part of the spring
    springZigZags?: number; // number of zig-zags in the spring
    springThickness?: number; // thickness of the spring
    springColor?: string; // color of the spring
    massLocation?: number; // vertical position of the top of the mass (pre-rotation)
    massWidth?: number; // width of the mass (pre-rotation)
    massHeight?: number; // height of the mass (pre-rotation)
    massColor?: string; // color of the mass
    massLabel?: string; // label for the mass (optional)
    rotation?: number; // rotation of the entire system in degrees (clockwise) around (center, ceilingTop)
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import {
    AppletObject,
    LineFragment,
    Point,
    Polygon,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { getProjection2D } from '$lib/utils/Projection2D';

  let {
    center = -3,
    ceilingColor = PrimeColor.black,
    ceilingWidth = 3,
    ceilingTop = 4,
    ceilingThickness = 0.2,
    springStraightPart = 0.3,
    springRadius = 0.25,
    springZigZags = 8,
    springThickness = 0.1,
    springColor = PrimeColor.blue,
    massLocation = 0,
    massWidth = 0.7,
    massHeight = massWidth,
    massColor = PrimeColor.yellow,
    massLabel = undefined,
    rotation = 0
  }: MassSpring2DProps = $props();

  const projection = getProjection2D();
  const origin = $derived(new Vector2(center, ceilingTop));
  const scaledOrigin = $derived(projection.toScreen(origin));

  const ceilingStart = $derived(new Vector2(center - ceilingWidth / 2, ceilingTop));
  const startSpring = $derived(new Vector2(ceilingWidth / 2, -ceilingThickness).add(ceilingStart));
  const startZigZag = $derived(new Vector2(0, -springStraightPart).add(startSpring));
  const endSpring = $derived(new Vector2(startSpring.x, massLocation + massHeight / 2));
  const endZigZag = $derived(new Vector2(startSpring.x, endSpring.y + springStraightPart));
  const jump = $derived((startZigZag.y - endZigZag.y) / springZigZags);
  const quarterJump = $derived(jump / 4);

  let listZigZag = $derived.by(() => {
    let tempList = [startSpring, startZigZag];
    for (let i = 0; i < springZigZags; i++) {
      tempList.push(
        new Vector2(startZigZag.x - springRadius, startZigZag.y - quarterJump - i * jump)
      );
      tempList.push(
        new Vector2(startZigZag.x + springRadius, startZigZag.y - quarterJump - (i + 0.5) * jump)
      );
    }
    tempList.push(endZigZag);
    tempList.push(endSpring);
    return tempList;
  });

  const templatedObjects = $derived.by(() => {
    const appletObjects: AppletObject[] = [];
    // Spring
    listZigZag.forEach((point, index) => {
      if (index > 0 && index < listZigZag.length - 1) {
        appletObjects.push(new Point(point, springColor, { radius: (springThickness - 0.02) / 2 }));
      }
    });
    appletObjects.push(
      new LineFragment(startSpring, startZigZag, springColor, { width: springThickness })
    );
    for (let i = 2; i < 2 * springZigZags + 2; i += 2) {
      const start = listZigZag.at(i);
      const end = listZigZag.at(i + 1);
      if (start !== undefined && end !== undefined) {
        appletObjects.push(
          new LineFragment(start, end, springColor + PrimeColor.opacity(0.8), {
            width: springThickness
          })
        );
      }
    }
    for (let i = 1; i < 2 * springZigZags + 2; i += 2) {
      const start = listZigZag.at(i);
      const end = listZigZag.at(i + 1);
      if (start !== undefined && end !== undefined) {
        appletObjects.push(new LineFragment(start, end, springColor, { width: springThickness }));
      }
    }
    appletObjects.push(
      new LineFragment(endZigZag, endSpring, springColor, { width: springThickness })
    );
    // Ceiling
    appletObjects.push(
      new Polygon(
        [
          ceilingStart,
          new Vector2(ceilingWidth, 0).add(ceilingStart),
          new Vector2(ceilingWidth, -ceilingThickness).add(ceilingStart),
          new Vector2(0, -ceilingThickness).add(ceilingStart)
        ],
        ceilingColor,
        { fillStyle: 'dashed' }
      )
    );
    // Mass
    const mass = [
      new Vector2(-massWidth / 2, 0).add(endSpring),
      new Vector2(massWidth / 2, 0).add(endSpring),
      new Vector2(massWidth / 2, -massHeight).add(endSpring),
      new Vector2(-massWidth / 2, -massHeight).add(endSpring)
    ];
    appletObjects.push(
      new Polygon(mass, massColor + PrimeColor.opacity(0.7), { fillStyle: 'full' }),
      new Polygon(mass, massColor, { fillStyle: 'none' })
    );
    if (massLabel !== undefined) {
      appletObjects.push(
        new Text(massLabel, new Vector2(0, -massHeight / 2).add(endSpring), PrimeColor.black, {
          alignX: 'center',
          alignY: 'center'
        })
      );
    }
    return appletObjects;
  });
</script>

<g transform="rotate({rotation}, {scaledOrigin.x}, {scaledOrigin.y})">
  <TemplateComponent objects={templatedObjects} />
</g>
