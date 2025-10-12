<script>
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Polygon3D from '$lib/threlte/Polygon3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import { _ } from 'svelte-i18n';

  let P = new MathVector3(2, 1, 0);
  let Q = new MathVector3(2, 2, 2);
  let R = new MathVector3(3, 1, 1);

  const PQ = Q.clone().sub(P);
  const PR = R.clone().sub(P);
  const n = PQ.cross(PR);

  const formulas = $derived.by(() => {
    const area = 0.5 * n.length();

    return [
      new Formula(
        `\\mathbf{\\$1} = \\overrightarrow{\\mathbf{\\$2}} \\times \\overrightarrow{\\mathbf{\\$3}} = \\$4`
      )
        .addAutoParam('n', PrimeColor.orange)
        .addAutoParam('PQ', PrimeColor.blue)
        .addAutoParam('PR', PrimeColor.blue)
        .addAutoParam(
          `\\begin{bmatrix} ${n.z} \\\\ ${n.x} \\\\ ${n.y} \\end{bmatrix}`,
          PrimeColor.orange
        ),
      new Formula(
        `\\text{\\$1}(\\Delta \\mathbf{PQR}) = \\frac{1}{2} ||\\mathbf{n}|| = ${round(area, 1)}`
      ).addAutoParam($_('applets.crossproduct.areatriangle.area_label'))
    ];
  });
</script>

<Canvas3D cameraPosition={new Vector3(-0.74, 4.87, -16.15)} cameraZoom={100} {formulas}>
  <!-- N -->
  <Vector3D origin={P} direction={n} length={n.length()} color={PrimeColor.orange} />
  <Latex3D position={P.clone().add(n)} extend={0.2} latex={'\\mathbf{n}'} hasBackground />

  <!-- P -->
  <Point3D position={P} color={PrimeColor.raspberry} size={0.1} />
  <Latex3D position={P} offset={new Vector3(-0.3, -0.1, 0)} latex={'\\mathbf{P}'} hasBackground />

  <!-- Q -->
  <Point3D position={Q} color={PrimeColor.raspberry} size={0.1} />
  <Latex3D position={Q} offset={new Vector3(0.2, -0.3, -0.1)} latex={'\\mathbf{Q}'} hasBackground />

  <!-- R -->
  <Point3D position={R} color={PrimeColor.raspberry} size={0.1} />
  <Latex3D position={R} offset={new Vector3(-0.3, -0.1, 0)} latex={'\\mathbf{R}'} hasBackground />

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
  <Polygon3D points={[P, Q, R]} color={PrimeColor.yellow} opacity={0.2} />
  <Latex3D
    position={P.clone().add(Q.clone().multiplyScalar(0.5))}
    offset={new Vector3(0, 0, 0)}
    latex={`\\text{\\textcolor{${PrimeColor.yellow}}{A}} = \\text{${$_('applets.crossproduct.areatriangle.area_label')}}(\\Delta \\mathbf{PQR})`}
    hasBackground
  />

  <Axis3D />
</Canvas3D>
