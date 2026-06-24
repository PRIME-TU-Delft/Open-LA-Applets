<script lang="ts">
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import GridCanvas3D from '$lib/common/GridCanvas3D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { MathVector3 } from '$lib/utils/MathVector';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import { Formula } from '$lib/utils/Formulas';

  const draggablesTL = [new Draggable(new Vector2(2, 1), PrimeColor.raspberry, 'P')];

  const controls = Controls.addSlider(1, 0, 3, 0.1, PrimeColor.blue);

  const formulas: Formula[] = [new Formula('f(x) = x')];
</script>

<!-- eslint-disable-next-line local-rules/no-hardcoded-title -->
<CanvasGrid rows={2} columns={2} title="Canvas Grid Demo" {controls} {formulas}>
  <GridCanvas2D gridColumn="1" gridRow="1" draggables={draggablesTL}>
    <Point2D position={draggablesTL[0].position} color={PrimeColor.raspberry} />
    <Circle2D position={new Vector2(0, 0)} radius={controls[0]} color={PrimeColor.blue} />
  </GridCanvas2D>

  <GridCanvas2D gridColumn="1" gridRow="2">
    <Point2D position={draggablesTL[0].position} color={PrimeColor.raspberry} />
    <Line2D start={new Vector2(-2, -2)} end={new Vector2(2, 2)} color={PrimeColor.cyan} />
    <Point2D position={new Vector2(0, 0)} color={PrimeColor.darkGreen} />
  </GridCanvas2D>

  <GridCanvas3D gridColumn="2" gridRow="1 / span 2" cameraPosition={new MathVector3(5, 5, 5)}>
    <Axis3D />
    <Vector3D
      length={3 * controls[0]}
      color={PrimeColor.blue}
      direction={new MathVector3(-1, 0.5, 1)}
    />
  </GridCanvas3D>
</CanvasGrid>
