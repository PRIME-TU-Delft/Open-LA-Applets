<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { confettiState } from '$lib/stores/confetti.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';
  import { Vector2 } from 'three';

  function randomVector() {
    const x = Math.floor((Math.random() * 5 - 3) * 2) / 2;
    const y = Math.floor((Math.random() * 5 - 3) * 2) / 2;

    return new Vector2(x, y);
  }

  // Target to reach
  let target = $state(randomVector());

  const controls = Controls.addButton(
    $_('applets.injectivity_and_surjectivity.injsurj_injex_example.new_target'),
    PrimeColor.raspberry,
    () => {
      target = randomVector();
    }
  );

  function transform(vector: Vector2) {
    // Transform with the matrix [1 -1; 1 1]
    return new Vector2(vector.x - vector.y, vector.x + vector.y);
  }

  function releaseFunction(vector: Vector2) {
    if (vector.distanceTo(target) < 0.5) {
      confettiState.center();
      vector = target.clone();
    }

    return vector;
  }

  const draggables = [
    new Draggable(new Vector2(2, 1), PrimeColor.blue, '\\mathbf{v_1}', (v) => v, releaseFunction)
  ];

  const formulas = $derived.by(() => {
    const f1 = new Formula(
      'T(\\mathbf{v})=\\begin{pmatrix}1 & -1 \\\\ 1 & 1 \\end{pmatrix}\\mathbf{v}'
    );

    return [f1];
  });
</script>

<Canvas2D
  {draggables}
  {formulas}
  {controls}
  showFormulasDefault
  cameraZoom={1.75}
  cameraPosition={new Vector2(0, 2)}
  splitCanvas2DProps={{ cameraZoom: 1.5, cameraPosition: new Vector2(0, 2) }}
>
  {#each draggables as draggable (draggable.id)}
    <Vector2D
      direction={draggable.position}
      length={draggable.position.length()}
      color={draggable.color}
    />
  {/each}

  {#snippet splitCanvas2DChildren()}
    <Point2D position={transform(target)} color={PrimeColor.raspberry} pulse />
    <Latex2D
      latex={'\\text{Target}'}
      position={transform(target)}
      offset={new Vector2(-0.55, -0.2)}
      extend={0.3}
    />

    {#each draggables as draggable, index (draggable.id)}
      {@const transformed = transform(draggable.position)}
      <Vector2D direction={transformed} length={transformed.length()} color={draggable.color} />

      <Latex2D
        position={transformed}
        offset={new Vector2(-0.2, 0.3)}
        latex={`T(\\mathbf{v_${index + 1}})`}
        color={draggable.color}
        extend={0.3}
      />
    {/each}
  {/snippet}
</Canvas2D>
