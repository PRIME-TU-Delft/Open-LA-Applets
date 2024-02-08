<script lang="ts">
  import { Sliders } from '$lib/utils/Slider';
  import { RightAngle, Canvas2D, Latex2D, Vector2D, Draggable2D, Line2D, Point2D } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { Formula } from '$lib/utils/Formulas';

  let sliders = new Sliders().addSlider(0, 0, 2 * Math.PI, 0.1 * Math.PI)
  let formulas: Formula[] = [];

  let P = new Vector2(2, 1.5);
  let Q = new Vector2(6, -0.5);
  let PQ = Q.clone().sub(P);
  $: N = new Vector2(1, 2).rotateAround(new Vector2(0, 0), sliders.x);

  let L_offset = new Vector2(0, 2.5);
  $: L_dir = new Vector2(N.y, N.clone().x * -1); 
  $: L_start = L_dir.clone().multiplyScalar(-10).add(P);
  $: L_end = L_dir.clone().multiplyScalar(10).add(P);
  $: L_label = L_dir.clone().multiplyScalar(4).add(new Vector2(0, 2));

  function round(x: number) {
    return Math.round(x * 100) / 100
  }

  function setFormulas(n: Vector2, pq: Vector2) {
    const f1 = new Formula('\\vec{n} = \\begin{bmatrix} ' + round(n.x) + ' \\\\ ' + round(n.y) + ' \\end{bmatrix}');
    const f2 = new Formula('\\vec{PQ} = \\begin{bmatrix} ' + round(pq.x) + ' \\\\ ' + round(pq.y) + ' \\end{bmatrix}');
    const f3 = new Formula('\\vec{n} \\cdot \\vec{PQ} = ' + round(n.dot(pq)))

    formulas = [f1, f2, f3];
  }

  $: setFormulas(N, PQ);

</script>

<Canvas2D zoom={0.9} bind:sliders {formulas}>

  <!-- RightAngle -->
  <RightAngle vs={[N, L_dir]} size={0.3} lineWidth={0.02} origin={P}/>

  <!-- Line L-->
  <Line2D start={L_start} end={L_end} color={PrimeColor.blue}></Line2D>
  <Latex2D latex={'\\mathcal{L}'} position={L_label} color={PrimeColor.blue} />

  <!-- Vectors -->
  <Vector2D origin={P} direction={PQ} length={PQ.length()} color={PrimeColor.darkGreen}></Vector2D>

  <Vector2D origin={P} direction={N} length={N.length()} color={PrimeColor.blue}>
    <Latex2D latex={'\\vec{n}'} position={N.clone().add(P).add(new Vector2(0.3, 0.3))} color={PrimeColor.blue} />
  </Vector2D>

  <!-- Points -->
  <Point2D position={P} color={PrimeColor.yellow}></Point2D>
  <Latex2D latex={'P'} position={P.clone().add(new Vector2(-0.1, -0.2))} color={PrimeColor.yellow} />

  <Point2D position={Q} color={PrimeColor.red}></Point2D>
  <Latex2D latex={'Q'} position={Q.clone().add(new Vector2(-0.1, -0.2))} color={PrimeColor.red} />

</Canvas2D>
