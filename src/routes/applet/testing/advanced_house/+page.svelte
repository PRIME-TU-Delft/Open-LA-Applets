<script>
  import { Controls } from '$lib/controls/Controls';
  import { Matrix } from '$lib/controls/Matrix.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Matrix2 from '$lib/utils/Matrix2.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { untrack } from 'svelte';
  import { Vector2 } from 'three';

  const controls = Controls.addSortableMatrix([
    new Matrix(new Matrix2(0, 1, 1, 0), '\\mathcal{T}_A'),
    new Matrix(new Matrix2(2, 0, 0, 1), '\\mathcal{T}_B')
  ]);

  const matrices = $derived(controls.controls[0].matrices);

  const v1 = $derived(new Vector2(matrices[0].value.tl, matrices[0].value.bl));
  const v2 = $derived(new Vector2(matrices[0].value.tr, matrices[0].value.br));

  let t = $derived.by(() => {
    const m1 = matrices[0];
    const m2 = matrices[1];

    if (m1.disabled && m2.disabled) {
      return new Matrix2(1, 0, 0, 1);
    } else if (m1.disabled) {
      return untrack(() => new Matrix2(1, 0, 0, 1).multiply(m2.value));
    } else if (m2.disabled) {
      return untrack(() => new Matrix2(1, 0, 0, 1).multiply(m1.value));
    }

    return untrack(() => new Matrix2(1, 0, 0, 1).multiply(m1.value).multiply(m2.value));
  });

  let transformation = $derived(`matrix(${t.tl} ${t.tr} ${t.bl} ${t.br} 0 0)`);
</script>

<Canvas2D {controls}>
  <Vector2D direction={v1} length={v1.length()} color={PrimeColor.darkGreen} />
  <Vector2D direction={v2} length={v2.length()} color={PrimeColor.darkGreen} />

  <g transform={transformation}>
    <image
      transform="translate(0,1) scale(1,-1)"
      x="0"
      y="0"
      width="1"
      height="1"
      xlink:href="/house.svg"
    />
  </g>
</Canvas2D>
