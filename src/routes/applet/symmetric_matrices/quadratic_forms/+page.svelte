<script lang="ts">
    import { Controls } from "$lib/controls/Controls";
    import ExplicitFunction2D from "$lib/d3/ExplicitFunction2D.svelte";
    import InfiniteLine2D from "$lib/d3/InfiniteLine2D.svelte";
    import Axis3D from "$lib/threlte/Axis3D.svelte";
    import Canvas3D from "$lib/threlte/Canvas3D.svelte";
    import PlaneFromNormal from "$lib/threlte/planes/PlaneFromNormal.svelte";
    import { Formula } from "$lib/utils/Formulas";
    import { round } from "$lib/utils/MathLib";
    import { PrimeColor } from "$lib/utils/PrimeColors";
    import { Vector2, Vector3 } from "three";

    const formulas = $derived.by(() => {
        let f = new Formula('\\$1 x_1^2 + \\$2 x_1 x_2 + \\$3 x_2^2 = \\$4')
          .addAutoParam(1, PrimeColor.yellow)
          .addAutoParam(1, PrimeColor.yellow)
          .addAutoParam(1, PrimeColor.yellow)
          .addAutoParam(round(k,1), PrimeColor.raspberry);

        return [f];
    });

    const controls = $derived.by(() => {
        return Controls.addSlider(3, -10, 10, 0.1, PrimeColor.raspberry, {
          label: "k",
          valueFn: (v) => round(v, 1).toString()
        }).addToggle(true, "\\text{Primary axes}", PrimeColor.darkGreen);
    });

    const k = $derived(controls[0]);
    const show_primary = $derived(controls[1]);

    const plane_position = $derived(new Vector3(0,k,0));

    const primary_axis1 = new Vector2(1, 1);
    const primary_axis2 = new Vector2(1, -1);

</script>

<Canvas3D {controls} {formulas} title="Quadratic forms">
  <Axis3D />

  <PlaneFromNormal normal={new Vector3(0,1,0)} position={plane_position} color={PrimeColor.raspberry} />

  {#snippet splitCanvas2DChildren()}
  
    <ExplicitFunction2D func="y=x^2 + 2" />
    <ExplicitFunction2D func="y=-x^2 - 2" />

    {#if show_primary}
      <InfiniteLine2D direction={primary_axis1} isDashed={true} color={PrimeColor.black + PrimeColor.opacity(0.5)} />
      <InfiniteLine2D direction={primary_axis2} isDashed={true} color={PrimeColor.black + PrimeColor.opacity(0.5)} />
    {/if}
  {/snippet}
</Canvas3D>
