<script>
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  let controls = Controls.addSlider(1, 0, 2, 0.5);

  let v = $derived(new MathVector3(3, controls[0], 2));
</script>

<Canvas3D {controls}>
  <Axis3D />
  <Vector3D direction={v} color={PrimeColor.raspberry} />
  <Latex3D position={v} extend={0.75} color={PrimeColor.raspberry} latex={v.toLatexString()} />
</Canvas3D>
