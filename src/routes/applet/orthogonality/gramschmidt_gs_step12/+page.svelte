<script>
  import { Axis3D, Canvas3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
</script>

<Canvas3D>
  <Vector3D direction={new Vector3(5, 2, 1)} length={3} color={PrimeColor.darkGreen} />
  <Vector3D direction={new Vector3(-5, 1, 1)} length={3} color={PrimeColor.yellow} />
  <Axis3D showNumbers />

  <svelte:fragment slot="splitCanvas">
    <Vector3D direction={new Vector3(2, 5, 1)} length={3} color={PrimeColor.red} />
    <Vector3D direction={new Vector3(1, 5, 1)} length={3} color={PrimeColor.blue} />

    <Axis3D showNumbers />
  </svelte:fragment>
</Canvas3D>
