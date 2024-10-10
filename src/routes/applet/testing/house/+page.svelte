<script>
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let draggables = [
    new Draggable(new Vector2(1, 0), PrimeColor.darkGreen),
    new Draggable(new Vector2(0, 1), PrimeColor.blue)
  ];

  const transformMatrixStr = $derived.by(() => {
    const d1 = draggables[0].position;
    const d2 = draggables[1].position;

    return `matrix(${d1.x} ${d1.y} ${d2.x} ${d2.y} 0 0)`;
  });

  const formulas = $derived.by(() => {
    const d1 = draggables[0].position;
    const d2 = draggables[1].position;

    const f1 = new Formula(
      `T(\\mathbf{x})=\\begin{bmatrix} 
        ${round(d1.x, 1)} & ${round(d2.x, 1)} \\\\ 
        ${round(d1.y, 1)} & ${round(d2.y, 1)} 
      \\end{bmatrix}\\mathbf{x}`
    );

    return [f1];
  });
</script>

<Canvas2D
  cameraPosition={new Vector2(2, 1)}
  cameraZoom={3}
  splitCanvas2DProps={{ draggables, cameraPosition: new Vector2(2, 1), cameraZoom: 3 }}
  {formulas}
  showFormulasDefault
>
  <image
    transform="translate(0,1) scale(1,-1)"
    x="0"
    y="0"
    width="1"
    height="1"
    xlink:href="/house.svg"
  />

  <Vector2D direction={new Vector2(1, 0)} color={PrimeColor.darkGreen} />
  <Vector2D direction={new Vector2(0, 1)} color={PrimeColor.blue} />

  {#snippet splitCanvas2DChildren()}
    <g transform={transformMatrixStr}>
      <image
        transform="translate(0,1) scale(1,-1)"
        x="0"
        y="0"
        width="1"
        height="1"
        xlink:href="/house.svg"
      />
    </g>

    <Vector2D
      direction={draggables[0].position}
      length={draggables[0].position.length()}
      color={PrimeColor.darkGreen}
    />
    <Vector2D
      direction={draggables[1].position}
      length={draggables[1].position.length()}
      color={PrimeColor.blue}
    />
  {/snippet}
</Canvas2D>
