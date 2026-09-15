<script lang="ts" module>
  import type { Arc2DProps } from './Arc2D.svelte';

  type LabelProp = {
    label?: Snippet<[Vector2]>;
  };

  export type SmallestArc2DProps = Arc2DProps & LabelProp;
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Vector2 } from 'three';
  import Angle2D from './Angle2D.svelte';
  import { getProjection2D } from './Projection2D';
  import { smallestSignedAngleDelta } from '$lib/utils/MathLib';

  const props: SmallestArc2DProps = $props();

  const projection = getProjection2D();

  const v = $derived(props.points[0]);
  const w = $derived(props.points[1]);

  /**
   * Makes sure that an angle is sticktly between 0 and 2 * PI
   * @param angle
   */
  function normalizeAngle(angle: number) {
    angle = angle % (2 * Math.PI);

    return angle < 0 ? angle + 2 * Math.PI : angle;
  }

  const angle = $derived(normalizeAngle(w.angle() - v.angle()) / Math.PI);

  // `v.angle()`/`w.angle()` are both raw values in [0, 2π), so a plain
  // `endAngle - startAngle` can be off by a full turn whenever the two
  // angles straddle the 2π/0 wrap point — e.g. v=233°, w=18° gives a raw
  // difference of -215° when the actual smallest arc between them is 145°.
  // smallestSignedAngleDelta corrects for that, so the arc Angle2D draws
  // never exceeds half a turn.
  const directEndAngle = $derived(v.angle() + smallestSignedAngleDelta(v.angle(), w.angle()));
  const flipEndAngle = $derived(w.angle() + smallestSignedAngleDelta(w.angle(), v.angle()));

  // `distance` is a screen-space radius, so the label position is computed from a
  // screen-space direction, then converted back to world space since label
  // consumers (e.g. Latex2D) expect a world-space position and project it themselves.
  function toWorldLabelPosition(screenDir: Vector2) {
    return projection.toWorld(screenDir.clone().multiplyScalar(props.distance || 1));
  }

  const labelPosition = $derived(
    toWorldLabelPosition(
      projection.toScreenDir(v).clone().add(projection.toScreenDir(w)).normalize()
    )
  );

  const screenVDir = $derived(projection.toScreenDir(v));
  const straightLabelPosition = $derived(
    toWorldLabelPosition(new Vector2(-screenVDir.y, screenVDir.x))
  );
</script>

<!-- 
@component
  @name SmallestArc2D
  @description
    A component that renders the smallest arc between two vectors. i.e. the arc that is less than PI/180deg.
  @props
    - points: Vector2[] - The two vectors that define the arc.
    - distance: number - The distance of the arc from the origin.
    - label: (position: Vector2) => Snippet - A function that returns a snippet that renders the label of the arc.

  @example
  <SmallestArc2D points={[w, v]} distance={1.5}>
    {#snippet label(position)}
      <Latex2D
        latex={'\\varphi'}
        {position}
        offset={new Vector2(0, 0.1)}
        extend={0.1}
        color={PrimeColor.black}
      />
    {/snippet}
  </SmallestArc2D>

-->

{#if angle == 1}
  <Angle2D {...props} startAngle={v.angle()} endAngle={directEndAngle} />
  {@render props.label?.(straightLabelPosition)}
{:else if angle > 1}
  <Angle2D {...props} startAngle={w.angle()} endAngle={flipEndAngle} />
  {@render props.label?.(labelPosition)}
{:else}
  <Angle2D {...props} startAngle={v.angle()} endAngle={directEndAngle} />
  {@render props.label?.(labelPosition)}
{/if}
