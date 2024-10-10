<script>
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Parallelepiped3D from '$lib/threlte/Parallelepiped3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  let P = new MathVector3(2, 1, 0);
  let Q = new MathVector3(2, 2, 2);
  let R = new MathVector3(3, 1, 1);

  const PQ = Q.clone().sub(P);
  const PR = R.clone().sub(P);

  const formulas = $derived.by(() => {
    const PQ = Q.clone().sub(P);
    const PR = R.clone().sub(P);
    const cp = PQ.cross(PR);

    return [
      new Formula(
        `\\vec{PQ} \\times \\vec{QR}= \\begin{bmatrix} ${cp.z} \\\\ ${cp.x} \\\\ ${cp.y} \\end{bmatrix}`
      )
    ];
  });
</script>

<Canvas3D cameraPosition={new Vector3(-14.7, 5.3, -6.4)} cameraZoom={100} {formulas}>
  <!-- P -->
  <Point3D position={P} color={PrimeColor.raspberry} size={0.1} />
  <Latex3D position={P} offset={new Vector3(-0.3, -0.1, 0)} latex="P" hasBackground />

  <!-- Q -->
  <Point3D position={Q} color={PrimeColor.raspberry} size={0.1} />
  <Latex3D position={Q} offset={new Vector3(0.2, -0.3, -0.1)} latex="Q" hasBackground />

  <!-- R -->
  <Point3D position={R} color={PrimeColor.raspberry} size={0.1} />
  <Latex3D position={R} offset={new Vector3(-0.3, -0.1, 0)} latex="R" hasBackground />

  <!-- PQ -->
  <Vector3D
    origin={P}
    direction={Q.clone().sub(P)}
    length={Q.clone().sub(P).length()}
    color={PrimeColor.blue}
  />

  <!-- PR -->
  <Vector3D
    origin={P}
    direction={R.clone().sub(P)}
    length={R.clone().sub(P).length()}
    color={PrimeColor.blue}
  />

  <!-- Helper vectors -->
  <Vector3D
    origin={Q}
    direction={R.clone().sub(Q)}
    length={R.clone().sub(Q).length()}
    color={PrimeColor.black}
    isDashed
    hideHead
  />

  <!-- P + R -->
  <Vector3D
    origin={R}
    direction={Q.clone().sub(P)}
    length={Q.clone().sub(P).length()}
    color={PrimeColor.darkGreen}
  />

  <!-- Q + R -->
  <Vector3D
    origin={Q}
    direction={R.clone().sub(P)}
    length={R.clone().sub(P).length()}
    color={PrimeColor.darkGreen}
  />

  <!-- Area -->
  <Parallelepiped3D points={[P, Q, R]} color={PrimeColor.yellow} opacity={0.2} />
  <Latex3D
    position={P.clone().add(Q.clone().multiplyScalar(0.5)).add(PR.clone().multiplyScalar(0.5))}
    offset={new Vector3(0, 0, 0)}
    latex={`\\text{\\textcolor{${PrimeColor.yellow}}{A}} = 2 \\cdot P \\thinspace Q \\thinspace R`}
    hasBackground
  />

  <Axis3D />
</Canvas3D>
