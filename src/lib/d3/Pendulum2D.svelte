<script lang="ts" module>
  import { Vector2 } from 'three';

  export type Pendulum2DProps = {
    origin?: Vector2; // point where the pendulum is attached
    ceilingColor?: string; // color of the ceiling
    ceilingWidth?: number; // width of the ceiling
    ceilingThickness?: number; // thickness of the ceiling
    stringLength?: number; // length of the string, including bob radius
    stringAngle?: number; // angle of the string in degrees (counterclockwise from vertical)
    stringThickness?: number; // thickness of the string
    stringColor?: string; // color of the string
    bobRadius?: number; // radius of the bob
    bobColor?: string; // color of the bob
    bobLabel?: string; // label for the bob (optional)
  };
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { AppletObject, LineFragment, Polygon } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';

  let {
    origin = new Vector2(0, 5),
    ceilingColor = PrimeColor.black,
    ceilingWidth = 3,
    ceilingThickness = 0.2,
    stringLength = 5,
    stringAngle = 15,
    stringThickness = 0.05,
    stringColor = PrimeColor.blue,
    bobRadius = 0.3,
    bobColor = PrimeColor.yellow,
    bobLabel = undefined
  }: Pendulum2DProps = $props();

  const ceilingTopLeft = $derived(
    new Vector2(origin.x - ceilingWidth / 2, origin.y + ceilingThickness)
  );
  const ceilingTopRight = $derived(
    new Vector2(origin.x + ceilingWidth / 2, origin.y + ceilingThickness)
  );
  const ceilingBottomLeft = $derived(new Vector2(origin.x - ceilingWidth / 2, origin.y));
  const ceilingBottomRight = $derived(new Vector2(origin.x + ceilingWidth / 2, origin.y));
  const ceiling = $derived([
    ceilingTopLeft,
    ceilingTopRight,
    ceilingBottomRight,
    ceilingBottomLeft
  ]);
  const stringEnd = $derived(
    new Vector2(
      origin.x + stringLength * Math.sin((stringAngle * Math.PI) / 180),
      origin.y - stringLength * Math.cos((stringAngle * Math.PI) / 180)
    )
  );

  const templatedObjects = $derived.by(() => {
    const appletObjects: AppletObject[] = [];
    // String
    appletObjects.push(
      new LineFragment(origin, stringEnd, stringColor, { width: stringThickness })
    );
    // Ceiling
    appletObjects.push(new Polygon(ceiling, ceilingColor, { fillStyle: 'dashed' }));
    return appletObjects;
  });
</script>

// Ceiling & String
<TemplateComponent objects={templatedObjects} />
// Bob
<Circle2D
  position={stringEnd}
  radius={bobRadius}
  color={PrimeColor.white}
  fill={PrimeColor.white}
/>
<Circle2D
  position={stringEnd}
  radius={bobRadius}
  color={bobColor}
  fill={bobColor + PrimeColor.opacity(0.7)}
/>
{#if bobLabel}
  <Latex2D
    latex={bobLabel}
    color={PrimeColor.black}
    position={stringEnd}
    alignX="center"
    alignY="center"
  />
{/if}
