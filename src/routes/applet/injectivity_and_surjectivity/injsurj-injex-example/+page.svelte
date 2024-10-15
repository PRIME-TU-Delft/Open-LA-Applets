<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { confettiState } from '$lib/stores/confetti.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { untrack } from 'svelte';
  import { Vector2 } from 'three';

  const controls = Controls.addDropdown(
    'Transformation 1',
    ['Transformation 1', 'Transformation 2', 'Transformation 3'],
    PrimeColor.blue
  );

  const draggables = [
    new Draggable(new Vector2(-1, 2), PrimeColor.blue),
    new Draggable(new Vector2(3, 2), PrimeColor.raspberry)
  ];

  const vDistances = $derived(draggables[0].position.distanceTo(draggables[1].position));
  const TvDistances = $derived(
    transform(draggables[0].position).distanceTo(transform(draggables[1].position))
  );

  function transform(vector: Vector2) {
    switch (controls[0]) {
      case 'Transformation 1':
        // Transform 1 - with the matrix [0.8 -2; -0.6 1.5]
        return new Vector2(0.8 * vector.x - 2 * vector.y, -0.6 * vector.x + 1.5 * vector.y);
      case 'Transformation 2':
        // Transform 2 - with the matrix [0.5 2; 0.9 -1]
        return new Vector2(0.5 * vector.x + 2 * vector.y, 0.9 * vector.x - vector.y);
      case 'Transformation 3':
        // Transform 3 - with the matrix [1 3; 2 4]
        return new Vector2(vector.x + 3 * vector.y, 2 * vector.x + 4 * vector.y);
      default:
        return vector;
    }
  }

  const formulas = $derived.by(() => {
    let formulas = [];

    switch (controls[0]) {
      case 'Transformation 1':
        const f1 = new Formula(
          'T(\\mathbf{v})=\\begin{bmatrix}0.8 & -2 \\\\ -0.6 & 1.5 \\end{bmatrix}\\mathbf{v}'
        );
        formulas.push(f1);
        break;
      case 'Transformation 2':
        const f2 = new Formula(
          'T(\\mathbf{v})=\\begin{bmatrix}0.5 & 2 \\\\ 0.9 & -1 \\end{bmatrix}\\mathbf{v}'
        );
        formulas.push(f2);
        break;
      case 'Transformation 3':
        const f3 = new Formula(
          'T(\\mathbf{v})=\\begin{bmatrix}1 & 3 \\\\ 2 & 4 \\end{bmatrix}\\mathbf{v}'
        );
        formulas.push(f3);
        break;
    }

    const f4 = new Formula(
      `\\mathbf{v_1} ${vDistances < 0.1 ? '=' : '\\neq'} \\mathbf{v_2} \\quad T(\\mathbf{v_1}) ${TvDistances < 0.1 ? '=' : '\\neq'} T(\\mathbf{v_2})`
    );
    formulas.push(f4);

    return formulas;
  });

  $effect(() => {
    if (vDistances >= 0.5 && TvDistances < 0.1) {
      // Launch confetti
      untrack(() => confettiState.center(1000));
    }
  });
</script>

<Canvas2D {draggables} {formulas} {controls} showFormulasDefault>
  {#each draggables as draggable, index}
    <Vector2D
      direction={draggable.position}
      length={draggable.position.length()}
      color={draggable.color}
    />

    {#if vDistances >= 0.1}
      <Latex2D
        position={draggable.position}
        offset={new Vector2(-0.2, 0.3)}
        latex={`\\mathbf{v_${index + 1}}`}
        color={draggable.color}
        extend={0.3}
      />
    {/if}
  {/each}

  {#if vDistances < 0.1}
    <Latex2D
      position={draggables[0].position}
      offset={new Vector2(-0.5, 0.3)}
      latex={`\\mathbf{v_1} = T(\\mathbf{v_2})`}
      extend={0.3}
    />
  {/if}

  {#snippet splitCanvas2DChildren()}
    {#each draggables as draggable, index}
      {@const transformed = transform(draggable.position)}
      <Vector2D direction={transformed} length={transformed.length()} color={draggable.color} />

      {#if TvDistances >= 0.1}
        <Latex2D
          position={transformed}
          offset={new Vector2(-0.2, 0.3)}
          latex={`T(\\mathbf{v_${index + 1}})`}
          color={draggable.color}
          extend={0.3}
        />
      {/if}
    {/each}

    {#if TvDistances < 0.1}
      <Latex2D
        position={transform(draggables[0].position)}
        offset={new Vector2(-0.5, 0.3)}
        latex={`T(\\mathbf{v_1}) = T(\\mathbf{v_2})`}
        extend={0.3}
      />
    {/if}
  {/snippet}
</Canvas2D>
