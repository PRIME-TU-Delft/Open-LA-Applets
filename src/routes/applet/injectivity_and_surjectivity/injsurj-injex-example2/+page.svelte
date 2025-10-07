<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { confettiState } from '$lib/stores/confetti.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const controls = Controls.addDropdown(
    { en: 'Transformation 1', nl: 'Transformatie 1' },
    [
      { en: 'Transformation 1', nl: 'Transformatie 1' },
      { en: 'Transformation 2', nl: 'Transformatie 2' },
      { en: 'Transformation 3', nl: 'Transformatie 3' }
    ],
    PrimeColor.blue
  );

  const draggables = $derived.by(() => {
    let snapFn = (v: Vector2) => v;

    if (controls[0].en === 'Transformation 1') {
      const solution = new Vector2(70, 17).multiplyScalar(1 / 23);
      snapFn = (v: Vector2) => {
        if (v.distanceTo(solution) < 0.5) {
          confettiState.center();
          return solution;
        } else {
          return v;
        }
      };
    } else if (controls[0].en === 'Transformation 3') {
      const solution = new Vector2(-3, 2);
      snapFn = (v: Vector2) => {
        if (v.distanceTo(solution) < 0.5) {
          confettiState.center();
          return solution;
        } else {
          return v;
        }
      };
    }

    return [new Draggable(new Vector2(3, 2), PrimeColor.blue, '\\mathbf{v}', (v) => v, snapFn)];
  });

  const u = new Vector2(3, 2);

  function transform(vector: Vector2) {
    switch (controls[0].en) {
      case 'Transformation 1':
        // Transform 2 - with the matrix [0.5 2; 0.9 -1]
        return new Vector2(0.5 * vector.x + 2 * vector.y, 0.9 * vector.x - vector.y);
      case 'Transformation 2':
        // Transform 1 - with the matrix [0.8 -2; -0.6 1.5]
        return new Vector2(0.8 * vector.x - 2 * vector.y, -0.6 * vector.x + 1.5 * vector.y);
      case 'Transformation 3':
        // Transform 3 - with the matrix [1 3; 2 4]
        return new Vector2(vector.x + 3 * vector.y, 2 * vector.x + 4 * vector.y);
      default:
        return vector;
    }
  }

  const formulas = $derived.by(() => {
    let formulas = [];

    const TvDistances = transform(draggables[0].position).distanceTo(u);

    if (controls[0].en === 'Transformation 1') {
      const f2 = new Formula(
        'T(\\mathbf{v})=\\begin{bmatrix}0.5 & 2 \\\\ 0.9 & -1 \\end{bmatrix}\\mathbf{v}'
      );
      formulas.push(f2);
    } else if (controls[0].en === 'Transformation 2') {
      const f1 = new Formula(
        'T(\\mathbf{v})=\\begin{bmatrix}0.8 & -2 \\\\ -0.6 & 1.5 \\end{bmatrix}\\mathbf{v}'
      );
      formulas.push(f1);
    } else if (controls[0].en === 'Transformation 3') {
      const f3 = new Formula(
        'T(\\mathbf{v})=\\begin{bmatrix}1 & 3 \\\\ 2 & 4 \\end{bmatrix}\\mathbf{v}'
      );
      formulas.push(f3);
    }

    const f4 = new Formula(`T(\\mathbf{v}) ${TvDistances < 0.1 ? '=' : '\\neq'} \\mathbf{u}`);
    formulas.push(f4);

    return formulas;
  });
</script>

<Canvas2D
  {draggables}
  {formulas}
  {controls}
  cameraZoom={1.5}
  cameraPosition={new Vector2(0, 2)}
  showFormulasDefault
  splitCanvas2DProps={{ cameraZoom: 1.5, cameraPosition: new Vector2(2, 2) }}
>
  {#each draggables as draggable (draggable.id)}
    <Vector2D
      direction={draggable.position}
      length={draggable.position.length()}
      color={draggable.color}
    />
  {/each}

  {#snippet splitCanvas2DChildren()}
    <Vector2D direction={u} length={u.length()} color={PrimeColor.raspberry} />
    <Latex2D position={u} color={PrimeColor.raspberry} latex={'\\mathbf{u}'} />

    {#each draggables as draggable (draggable.id)}
      {@const transformed = transform(draggable.position)}
      <Vector2D direction={transformed} length={transformed.length()} color={draggable.color} />

      <Latex2D
        position={transformed}
        offset={new Vector2(-0.2, 0.3)}
        latex={'T(\\mathbf{v})'}
        color={draggable.color}
        extend={0.3}
      />
    {/each}
  {/snippet}
</Canvas2D>
