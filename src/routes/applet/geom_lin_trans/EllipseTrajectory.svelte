<script lang="ts">
    import {

      Line3D,

    } from '$lib/threlte-components';

    import { parametic_point_on_circle_3D  as getPoint} from '$lib/utils/MathLib';
    import { Vector3 } from 'three';
  
    export let ellipse_radius = 5;
    export let no_trajectory_points = 35; //amt of points on tracetory
    export let reverse_in_red = false; //for refl applet
    const trajectory_color = '#AADBD0'; //hardcoded as line materials have no opacity
    const trajectory_color_red = '#E5ADBF'; //hardcoded as line materials have no opacity
    const ts = [...Array(no_trajectory_points)].map((_, i) =>[i , ( i *  (2*Math.PI/no_trajectory_points))]); // [index , val]


  </script>
  
    <!--Trail trajectory-->

    {#each ts as [i, t]}
      {#if i != 0}
        <Line3D points={[getPoint(t, ellipse_radius), getPoint(ts[i-1][1], ellipse_radius)]} color={trajectory_color}/>
      {:else}
        <Line3D points={[getPoint(0, ellipse_radius), getPoint(ts[no_trajectory_points-1][1], ellipse_radius)]} color={trajectory_color}/>
      {/if}
    {/each}

    {#if reverse_in_red}
    {#each ts as [i, t]}
      {#if i != 0}
        <Line3D points={[getPoint(t, ellipse_radius).multiply(new Vector3(1, -1, 1)), getPoint(ts[i-1][1], ellipse_radius).multiply(new Vector3(1, -1, 1))]} color={trajectory_color_red}/>
      {:else}
        <Line3D points={[getPoint(0, ellipse_radius).multiply(new Vector3(1, -1, 1)), getPoint(ts[no_trajectory_points-1][1], ellipse_radius).multiply(new Vector3(1, -1, 1))]} color={trajectory_color_red}/>
      {/if}
    {/each}
    {/if}
  
