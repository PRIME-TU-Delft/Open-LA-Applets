<script lang="ts">
  import { Canvas2D, Latex2D, Vector2D } from '$lib/d3-components';
  import { Axis3D, Latex3D, Vector3D } from '$lib/threlte-components';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Vector3 } from 'three';

  let e1 = new Vector2(1, 0);
  let e2 = new Vector2(0, 1);

  let e1Length = 1;
  let e2Length = 1;

  let te1 = new Vector3(0, 0, 1);
  let te2 = new Vector3(1, 0, 0);
  let te3 = new Vector3(0, 1, 0);

  function setFormulas(e1: Vector2, e2: Vector2) {
    const f1 = new Formula('e1 &= [\\$1, \\$2]^T')
      .addAutoParam(e1.x, PrimeColor.blue)
      .addAutoParam(e1.y, PrimeColor.blue);
    const f2 = new Formula('e2 &= [\\$1, \\$2]^T')
      .addAutoParam(e2.x, PrimeColor.darkGreen)
      .addAutoParam(e2.y, PrimeColor.darkGreen);

    return new Formulas(f1, f2).align();
  }

  function setSplitFormulas(te1: Vector3, te2: Vector3, te3: Vector3) {
    const f1 = new Formula('e1 &= [\\$1, \\$2, \\$3]^T')
      .addAutoParam(te1.x, PrimeColor.blue)
      .addAutoParam(te1.y, PrimeColor.blue)
      .addAutoParam(te1.z, PrimeColor.blue);

    const f2 = new Formula('e2 &= [\\$1, \\$2, \\$3]^T')
      .addAutoParam(te2.x, PrimeColor.darkGreen)
      .addAutoParam(te2.y, PrimeColor.darkGreen)
      .addAutoParam(te2.z, PrimeColor.darkGreen);

    const f3 = new Formula('e3 &= [\\$1, \\$2, \\$3]^T')
      .addAutoParam(te3.x, PrimeColor.raspberry)
      .addAutoParam(te3.y, PrimeColor.raspberry)
      .addAutoParam(te3.z, PrimeColor.raspberry);

    return new Formulas(f1, f2, f3).align();
  }

  $: formulas = setFormulas(e1, e2);
  $: splitFormulas = setSplitFormulas(te1, te2, te3);

  $: te1Latex = splitFormulas.get(0).clone().stripInvalid();
  $: te2Latex = splitFormulas.get(1).clone().removeColor().stripInvalid(); // remove color
  $: te3Latex = splitFormulas.get(2).clone().stripInvalid();
</script>

<Canvas2D {formulas} {splitFormulas} splitCanvas3DProps={{ cameraZoom: 100 }}>
  <!-- e1 -->
  <Vector2D direction={e1} length={e1Length} color={PrimeColor.blue} let:endPoint>
    <Latex2D
      latex={'\\mathbf{e_1}'}
      offset={new Vector2(-0.3, 0.4)}
      position={endPoint}
      color={PrimeColor.blue}
    />
  </Vector2D>

  <!-- e2 -->
  <Vector2D direction={e2} length={e2Length} color={PrimeColor.darkGreen} let:endPoint>
    <Latex2D
      latex={'\\mathbf{e_2}'}
      offset={new Vector2(0.2, -0.1)}
      position={endPoint}
      color={PrimeColor.darkGreen}
    />
  </Vector2D>

  <svelte:fragment slot="splitCanvas3d">
    <Axis3D showNumbers />

    <!-- e1 & e2 & e3 -->
    <Vector3D direction={te1} length={te1.length()} color={PrimeColor.blue} />
    <Vector3D direction={te2} length={te2.length()} color={PrimeColor.darkGreen} />
    <Vector3D direction={te3} length={te3.length()} color={PrimeColor.raspberry} />

    <Latex3D latex={`\\mathbf{${te1Latex.stringFormula}}`} position={te1} />
    <Latex3D latex={`\\mathbf{${te2Latex.stringFormula}}`} position={te2} />
    <Latex3D
      latex={`\\mathbf{${te3Latex.stringFormula}}`}
      position={te3}
      color={PrimeColor.raspberry}
    />
  </svelte:fragment>
</Canvas2D>
