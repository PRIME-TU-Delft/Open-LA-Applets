<script lang="ts" module>
  import type { Vector2 } from 'three';

  export type ArrowHead2DProps = {
    screenPosition: Vector2;
    angle: number;
    length: number;
    halfWidth: number;
    color?: string;
  };
</script>

<script lang="ts">
  let { screenPosition, angle, length, halfWidth, color = 'black' }: ArrowHead2DProps = $props();

  const rotationDeg = $derived((angle * 180) / Math.PI - 90);
</script>

<!-- @component
Fixed-size arrowhead drawn in screen space. It is deliberately NOT projected
through Projection2D: an arrowhead is a size, and sizes must not distort under
the canvas scale. Callers pass an already-projected position and an on-screen angle.

@props
- screenPosition: Vector2 - Centre of the base, in screen space (e.g. from `projection.toScreen`).
- angle: number - Direction the tip points, in radians, in screen space (e.g. `projection.toScreenDir(d).angle()`).
- length: number - Base-to-tip length, in screen units.
- halfWidth: number - Half the base width, in screen units.
- color: string - Fill colour.

@example
<ArrowHead2D screenPosition={projection.toScreen(p)} angle={Math.PI / 2} length={0.4} halfWidth={0.1} />
-->

<g transform="translate({screenPosition.x}, {screenPosition.y}) rotate({rotationDeg})">
  <polygon points="{halfWidth},0 {-halfWidth},0 0,{length}" fill={color} />
</g>
