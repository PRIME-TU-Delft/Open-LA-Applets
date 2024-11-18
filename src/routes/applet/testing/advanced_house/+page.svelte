<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Matrix } from '$lib/controls/Matrix.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import Matrix2 from '$lib/utils/Matrix2.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let flipped = $state(false);
  const mat1 = new Matrix(new Matrix2(0, 1, 1, 0), 'T_A', PrimeColor.blue);
  const mat2 = new Matrix(new Matrix2(2, 0, 0, 1), 'T_B', PrimeColor.raspberry);

  function flip() {
    flipped = !flipped;

    mat1.disabled = false;
    mat2.disabled = false;
  }

  const controls = $derived.by(() => {
    return Controls.add(flipped ? mat2 : mat1)
      .addButton('<>', PrimeColor.yellow, flip)
      .add(flipped ? mat1 : mat2);
  });

  // Derived matrices - if disabled, use identity matrix
  const shadowM1 = $derived(mat1.disabled ? Matrix2.I : controls[0]);
  const shadowM2 = $derived(mat2.disabled ? Matrix2.I : controls[2]);
  const transformation = $derived(shadowM1.multiply(shadowM2));

  // Transformation string for SVG element
  const transformationStr = $derived.by(() => {
    return `matrix(${transformation.tl} ${transformation.tr} ${transformation.bl} ${transformation.br} 0 0)`;
  });

  const formulas = $derived.by(() => {
    if (!mat1.disabled && !mat2.disabled) {
      // If both enabled
      return [
        new Formula('T = \\$1 \\cdot \\$2')
          .addAutoParam(flipped ? 'T_B' : 'T_A', flipped ? PrimeColor.raspberry : PrimeColor.blue)
          .addAutoParam(flipped ? 'T_A' : 'T_B', flipped ? PrimeColor.blue : PrimeColor.raspberry)
      ];
    } else if (!mat1.disabled) {
      // If only controls[0] enabled
      return [
        new Formula('T = \\$1').addAutoParam(
          flipped ? 'T_B' : 'T_A',
          flipped ? PrimeColor.raspberry : PrimeColor.blue
        )
      ];
    } else if (!mat2.disabled) {
      // If only controls[2] enabled
      return [
        new Formula('T = \\$1').addAutoParam(
          flipped ? 'T_A' : 'T_B',
          flipped ? PrimeColor.blue : PrimeColor.raspberry
        )
      ];
    }

    return [new Formula('T = I')];
  });
</script>

<Canvas2D {controls} {formulas}>
  <g transform={transformationStr}>
    <image
      transform="translate(0,2) scale(2,-2)"
      x="0"
      y="0"
      width="1"
      height="1"
      xlink:href="/house.svg"
    />

    <Vector2D direction={new Vector2(1, 0)} color={PrimeColor.blue} />
    <Vector2D direction={new Vector2(0, 1)} color={PrimeColor.raspberry} />
  </g>
</Canvas2D>
