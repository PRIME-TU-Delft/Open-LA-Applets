<script lang="ts">
  import { Axis2D, Canvas2D, Latex2D, Line2D, Point2D, Vector2D } from '$lib/p5-components';

  import { GridType } from '$lib/p5-components/components/Grids';
  import { Matrix3, Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
    import Draggables from '$lib/p5-components/components/Draggables.svelte';
    import RightAngle from '$lib/p5-components/components/RightAngle.svelte';

  const pointSize= 15;

  const dir_L = new Vector2(2, 1);
  const start_L = dir_L.clone().multiplyScalar(-30);
  const end_L = dir_L.clone().multiplyScalar(30);
  
  let u1 = new Vector2(3, 3);
  let u1_default = new Vector2(3, 3);

  let u2 = new Vector2(2, -1);
  let u2_default = new Vector2(2, -2);

  //TODO very bad math
  const w1 = dir_L.clone().rotateAround(new Vector2(0, 0) , -(1/2)*Math.PI)

  

    //othogonal proj u1 onto line L
  $: proj_u1 = dir_L.clone().multiplyScalar(dir_L.clone().dot(u1) / dir_L.clone().dot(dir_L));
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

  <!-- u1 -->
  <Point2D position={u1} color={PrimeColor.red} radius={pointSize}/>
  <Draggables bind:position={u1} defaultPosition={u1_default} color={PrimeColor.red} />

  <!-- u2 -->
  <Point2D position={u2} color={PrimeColor.red} radius={pointSize}/>
  <Draggables bind:position={u2} defaultPosition={u2_default} color={PrimeColor.red} />

  <!-- w1 -->
  <Vector2D direction={w1} color={PrimeColor.yellow} origin ={dir_L} />
  <RightAngle vs={[dir_L,w1]} origin={dir_L} size={0.2}/>

  <!-- T1(u1) -->
  <Point2D position={proj_u1} isSquare color={PrimeColor.ultramarine} radius={pointSize} />




  
</Canvas2D>
