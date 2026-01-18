<script>
  import Axis3D from '$lib/threlte/Axis3D.svelte';

  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
    import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Quaternion } from 'three';

  let a = $state(new MathVector3(1, 4, 1));
  let aLength = $state(4);
  const b = new MathVector3(-1, 2, 4);

  // This is a test for reseting the camera position in an animated fashion
  // This is used in `threlte/Camera3D.svelte` to reset the camera position

  // rotate a to b in 10 steps
  // with quaternions
  function handleClick() {
    const interval = setInterval(() => {
      const rot = new Quaternion().setFromUnitVectors(a.clone().normalize(), b.clone().normalize()); // (unit vectors)
      const delta = rot.slerp(new Quaternion(), 0.75);
      a.applyQuaternion(delta);

      a = a.clone();
    }, 100);

    setTimeout(() => {
      a = b.clone();
      clearInterval(interval);
    }, 1000);
  }
</script>

<Canvas3D cameraPosition={new MathVector3(-5, 10, 12)} cameraZoom={41}>
  <Vector3D direction={a} length={aLength} color={PrimeColor.orange} alwaysOnTop isDashed />
  <Vector3D direction={b} color={PrimeColor.darkGreen} noNormalise />

  <Axis3D showNumbers />
</Canvas3D>

<button
  onclick={() => {
    a = new MathVector3(0, 4, 0);
  }}
  style="position:absolute; bottom:1rem; left:1rem; background:lightcoral"
>
  reset orange
</button>

<button
  onclick={handleClick}
  style="position:absolute; bottom:3rem; left:1rem; background:lightgreen"
>
  animate orange to green
</button>
