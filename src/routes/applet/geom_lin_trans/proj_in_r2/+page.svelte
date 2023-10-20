<script lang="ts">
  import { Axis2D, Canvas2D, Latex2D, Line2D, Point2D, Vector2D } from '$lib/p5-components';

  import { GridType } from '$lib/p5-components/components/Grids';
  import { Matrix3, Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
    import Draggables from '$lib/p5-components/components/Draggables.svelte';
    import RightAngle from '$lib/p5-components/components/RightAngle.svelte';
    import Latex from '$lib/components/Latex.svelte';
    import Label from '$lib/p5-components/components/Label.svelte';

  const pointSize= 15;

  const dir_L = new Vector2(2, 1);
  const start_L = dir_L.clone().multiplyScalar(-30);
  const end_L = dir_L.clone().multiplyScalar(30);
  
  let u1 = new Vector2(3, 3);
  let u1_default = new Vector2(3, 3);

  let u2 = new Vector2(2, -1);
  let u2_default = new Vector2(2, -2);

  

  let w2 = new Vector2(1, -0.5);
  let w2_default = new Vector2(1, -0.5);

  //othogonal proj u1 onto line L
  $: proj_u1 = dir_L.clone().multiplyScalar(dir_L.clone().dot(u1) / dir_L.clone().dot(dir_L));

  //projection of u2 onto line L in direction of w2 gives proj
  $: temp = u2.clone().addScaledVector(w2, -4);
  $: proj_u2 = lineLineIntersection(temp, u2 , start_L, end_L).clone();

  //vector used to draw right angle
  $: w1 = u1.clone().sub(proj_u1);

  //todo move this to a utils file?
  function lineLineIntersection(A : Vector2,  B : Vector2 ,C : Vector2 , D : Vector2){
      var xcd = D.x - C.x;
      var ycd = D.y - C.y;
      var xac = A.x - C.x;
      var yac = A.y - C.y;
      var den = ycd*(B.x-A.x) - xcd*(B.y-A.y);
      var u0 =  ( xcd * yac - ycd * xac ) / den;
      return new Vector2(A.x+u0*(B.x-A.x), A.y+u0*(B.y-A.y));
    }     

</script>

<Canvas2D gridType={GridType.squareGrid}>
 


  <!-- L1 -->
  <Line2D
  start={start_L}
  end={end_L}
  color={PrimeColor.ultramarine}
  width={2}
  />
  
  <!-- guide lines -->
  <Line2D start={u1} end={proj_u1} isDashed color={PrimeColor.green} width={2}/>
  <Line2D start={u2} end={proj_u2} isDashed color={PrimeColor.green} width={2}/>

  <!-- u1 -->
  <Point2D position={u1} color={PrimeColor.red} radius={pointSize}/>
  <Draggables bind:position={u1} defaultPosition={u1_default} color={PrimeColor.red} />
  <Latex2D latex={`\\bold{u}_1`} position={u1} offset={new Vector2(0, 0.3)} color={PrimeColor.red}/>

  <!-- u2 -->
  <Point2D position={u2} color={PrimeColor.red} radius={pointSize}/>
  <Draggables bind:position={u2} defaultPosition={u2_default} color={PrimeColor.red} />
  <Latex2D latex={`\\bold{u}_2`} position={u2} offset={new Vector2(0, 0.3)} color={PrimeColor.red}/>

  <!-- w  (direction of projection u2) -->
  <Vector2D  direction={w2} color={PrimeColor.yellow}  />
  <Draggables bind:position={w2} defaultPosition={w2_default} color={PrimeColor.yellow} />
  <Latex2D latex={`\\bold{w}`} position={w2} offset={new Vector2(0, 0.3)} color={PrimeColor.yellow}/>

  <!-- T1(u1) -->
  <RightAngle vs={[ w1 , dir_L]} origin={proj_u1} size={0.25}/>
  <Point2D position={proj_u1} isSquare color={PrimeColor.ultramarine} radius={pointSize} />
  <Latex2D
  latex={`T_1(\\bold{u} _1)`}
  position={proj_u1}
  offset={new Vector2(0.2, -0.3)}
  color={PrimeColor.ultramarine} />

  <!-- T2(u2) -->
  <Point2D position={proj_u2} isSquare color={PrimeColor.ultramarine} radius={pointSize} />
  <Latex2D
  latex={`T_2(\\bold{u}_2)`}
  position={proj_u2}
  offset={new Vector2(-0.2, 0.2)}
  color={PrimeColor.ultramarine} />
  
</Canvas2D>
