<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const draggables = [new Draggable(new Vector2(2, 1), PrimeColor.blue, '\\mathbf{v}')];

  function transform(vector: Vector2) {
    // Transform with the matrix [1 -1; -1 1]
    return new Vector2(vector.x - vector.y, -vector.x + vector.y);
  }

  const formulas = $derived.by(() => {
    const f1 = new Formula(
      'T(\\mathbf{v})=\\begin{bmatrix}1 & -1 \\\\ -1 & 1 \\end{bmatrix}\\mathbf{v}'
    );

    return [f1];
  });
</script>

<Canvas2D {draggables} {formulas} showFormulasDefault>
  {#each draggables as draggable}
    <Vector2D
      direction={draggable.position}
      length={draggable.position.length()}
      color={draggable.color}
    />
  {/each}

  {#snippet splitCanvas2DChildren()}
    <InfiniteLine2D direction={new Vector2(1, -1)} color={PrimeColor.darkGreen} />

    {#each draggables as draggable}
      {@const transformed = transform(draggable.position)}
      <Vector2D direction={transformed} length={transformed.length()} color={draggable.color} />

      <Latex2D
        position={transformed}
        offset={new Vector2(0, 0.5)}
        latex={'T(\\mathbf{v})'}
        color={draggable.color}
        extend={0.3}
      />
    {/each}
  {/snippet}
</Canvas2D>
