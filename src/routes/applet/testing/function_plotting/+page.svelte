<script lang="ts">
    import ExplicitFunction2D from "$lib/d3/ExplicitFunction2D.svelte";
    import ImplicitFunction2D from "$lib/d3/ImplicitFunction2D.svelte";
    import Canvas2D from "$lib/d3/Canvas2D.svelte";
    import { PrimeColor } from "$lib/utils/PrimeColors";
</script>

<Canvas2D>
    <ExplicitFunction2D func="y=log(x)" color={PrimeColor.darkGreen} showArrows stepSize={0.15} />
    <ExplicitFunction2D func="y=sqrt(x^2)" color={PrimeColor.darkGreen} />
    <ImplicitFunction2D func="x^2/3^2 + y^2/2^2 - (2*x*y*cos(2.2))/(3*2) = (sin(2.2))^2" color={PrimeColor.blue} stepSize={0.1} showArrows />
</Canvas2D>