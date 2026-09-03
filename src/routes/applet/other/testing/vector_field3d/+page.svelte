<script lang="ts">
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import VectorField3D from '$lib/threlte/VectorField3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { MathVector3 } from '$lib/utils/MathVector';

  const swirl = (x: number, y: number) => new MathVector3(-y, x, Math.sin(x) * Math.cos(y));
  function colorByMagnitude(x: number, y: number) {
    const mag = Math.sqrt(x ** 2 + y ** 2);
    return mag > 3 ? PrimeColor.raspberry : mag > 1.5 ? PrimeColor.orange : PrimeColor.blue;
  }
</script>

<Canvas3D>
  <VectorField3D f={swirl} step={1} anchor="middle" colorFn={colorByMagnitude} /></Canvas3D
>
