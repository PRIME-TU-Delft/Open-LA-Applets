<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Vector2 } from 'three';

  const { Story } = defineMeta({
    title: 'Initialize/CanvasGrid',
    component: CanvasGrid
  });
</script>

<script lang="ts">
  import { globalState } from '$lib/stores/globalState.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { onDestroy } from 'svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import GridCanvas3D from '$lib/common/GridCanvas3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { Formula } from '$lib/utils/Formulas';

  onDestroy(() => {
    globalState.title = '';
  });

  const draggablesTL = [new Draggable(new Vector2(2, 1), PrimeColor.raspberry, 'P')];

  const controls = Controls.addSlider(1, 0, 3, 0.1, PrimeColor.blue);

  const formulas: Formula[] = [new Formula('f(x) = x')];
</script>

<!-- CanvasGrid lets you create a grid of different scenes. It works similarly to HTML grid layout.

Draggables are defined for each Canvas and collected by the main CanvasGrid. Controls, formulas and legend items are all shared by each canvas.

The syntax for cell column/row property is the same as with CSS: `<start-line> / <end-line>` (or `<start-line> / span <value>`) or only `<start-line>`. Hence, cells can span multiple columns or rows, as seen with the 3D scene. 

When using the CanvasGrid component use GridCanvas2D and GridCanvas3D as children.
-->
<Story name="Example">
  {#snippet template()}
    <div class="h-95 overflow-hidden rounded-lg">
      <CanvasGrid rows={2} columns={2} {controls} {formulas}>
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
    </div>
  {/snippet}
</Story>
