<script>
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Matrix2 from '$lib/utils/Matrix2.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const controls = Controls.addMatrix(new Matrix2(2, 0, 0, 1), '\\mathcal{T}_A').addMatrix(
    new Matrix2(0, 1, 1, 0),
    '\\mathcal{T}_B'
  );

  const matrix = $derived(controls[0]);

  const v1 = $derived(new Vector2(matrix.tl, matrix.bl));
  const v2 = $derived(new Vector2(matrix.tr, matrix.br));
</script>

<Canvas2D {controls}>
  <Vector2D direction={v1} length={v1.length()} color={PrimeColor.darkGreen} />
  <Vector2D direction={v2} length={v2.length()} color={PrimeColor.darkGreen} />
</Canvas2D>
