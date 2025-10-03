<script>
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let d1 = new Draggable(new Vector2(1, 2), PrimeColor.blue, 'z_1', Draggable.snapToGrid);
  let d2 = new Draggable(new Vector2(2, 0), PrimeColor.darkGreen, 'z_2', Draggable.snapToGrid);

  let draggables = [d1, d2];

  let v_result = $derived(d1.position.clone().add(d2.position));

  let v1_dashed = $derived(v_result.clone().sub(d2.position));
  let v2_dashed = $derived(v_result.clone().sub(d1.position));

  const formulas = $derived.by(() => {
    const f1 = new Formula('(\\$1 \\$7 \\$2 i) + (\\$3 \\$8 \\$4 i) = (\\$5 \\$9 \\$6 i)')
      .addAutoParam(Math.round(d1.position.x), PrimeColor.blue)
      .addAutoParam(Math.abs(Math.round(d1.position.y)), PrimeColor.blue)
      .addAutoParam(Math.round(d2.position.x), PrimeColor.darkGreen)
      .addAutoParam(Math.abs(Math.round(d2.position.y)), PrimeColor.darkGreen)
      .addAutoParam(Math.round(v_result.x), PrimeColor.raspberry)
      .addAutoParam(Math.abs(Math.round(v_result.y)), PrimeColor.raspberry)
      .addAutoParam(d1.position.y >= 0 ? '+' : '-', PrimeColor.blue)
      .addAutoParam(d2.position.y >= 0 ? '+' : '-', PrimeColor.darkGreen)
      .addAutoParam(v_result.y >= 0 ? '+' : '-', PrimeColor.raspberry);

    const f2 = new Formula('z_1 + z_2 = z_3');
    return [f2, f1];
  });
</script>

<Canvas2D
  {draggables}
  {formulas}
  title={{ en: 'Complex numbers addition', nl: 'Optellen van complexe getallen' }}
>
  <Vector2D direction={d1.position} length={d1.position.length()} color={PrimeColor.blue} />
  <Vector2D direction={d2.position} length={d2.position.length()} color={PrimeColor.darkGreen} />
  <Vector2D direction={v_result} length={v_result.length()} color={PrimeColor.raspberry} />
  <Latex2D latex="z_3" position={v_result} color={PrimeColor.raspberry} />

  <Vector2D
    direction={v1_dashed}
    length={v1_dashed.length()}
    isDashed={true}
    origin={d2.position}
    hideHead={true}
    color={PrimeColor.blue}
  />
  <Vector2D
    direction={v2_dashed}
    length={v2_dashed.length()}
    isDashed={true}
    origin={d1.position}
    hideHead={true}
    color={PrimeColor.darkGreen}
  />
</Canvas2D>
