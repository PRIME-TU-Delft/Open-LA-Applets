<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { DiagonalMatrix } from '$lib/controls/DiagonalMatrix.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import Matrix2 from '$lib/utils/Matrix2.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const mat = new DiagonalMatrix(new Matrix2(0, 1, 1, 0), 'T_A', PrimeColor.blue);

  const controls = $derived.by(() => {
    return Controls.add(mat);
  });

  // Derived matrices - if disabled, use identity matrix
  const shadowM1 = $derived(mat.disabled ? Matrix2.I : controls[0]);

  function transformVector(v: Vector2) {
    return new Vector2(
      shadowM1.tl * v.x + shadowM1.tr * v.y,
      shadowM1.bl * v.x + shadowM1.br * v.y
    );
  }

  // Transformation string for SVG element
  const transformationStr = $derived.by(() => {
    return `matrix(${shadowM1.tl} ${shadowM1.bl} ${shadowM1.tr} ${shadowM1.br} 0 0)`;
  });

  const formulas = $derived.by(() => {
    if (!mat.disabled) {
      // If only controls[1] enabled
      return [
        new Formula('T = \\$1').addAutoParam(
          transformationStr.replaceAll(' ', ','),
          PrimeColor.blue
        )
      ];
    }

    return [new Formula('T = T_I')];
  });
</script>

<Canvas2D {controls} {formulas} cameraZoom={2}>
  <g transform={transformationStr}>
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
    direction={transformVector(new Vector2(1, 0))}
    length={transformVector(new Vector2(1, 0)).length()}
    color={PrimeColor.darkGreen}
  >
    {#snippet children(endPoint)}
      <Latex2D
        position={endPoint}
        latex={'T_{e_1}'}
        color={PrimeColor.darkGreen}
        offset={new Vector2(0.1, 0.3)}
        fontSize={0.5}
      />
    {/snippet}
  </Vector2D>

  <Vector2D
    direction={transformVector(new Vector2(0, 1))}
    length={transformVector(new Vector2(0, 1)).length()}
    color={PrimeColor.orange}
  >
    {#snippet children(endPoint)}
      <Latex2D
        position={endPoint}
        latex={'T_{e_2}'}
        color={PrimeColor.orange}
        offset={new Vector2(0.15, 0)}
        fontSize={0.5}
      />
    {/snippet}
  </Vector2D>
</Canvas2D>
