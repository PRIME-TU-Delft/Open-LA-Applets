<script lang="ts">
  import { Line3D } from '$lib/threlte-components';

  import { parametic_point_on_circle_3D as getPoint } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  export let r = 5;
  export let no_trajectory_points = 70; //amt of points on trajetory
  export let reverse_in_red = false; //for refl applet
  export let trajectory_on_plane = false;

  //hardcoded as line materials have no opacity
  const trajectory_color_green = '#AADBD0';
  const trajectory_color_red = '#E5ADBF';
  const traj_color_orng = '#f19a1d';

  //make pair list if [i, t] -> (postition, value in range [0, 2pi])
  const ts = [...Array(no_trajectory_points)].map((_, i) => [
    i,
    i * ((2 * Math.PI) / no_trajectory_points)
  ]); // [index , val]

  function proj_t_plane(t: number) {
    let u = getPoint(t, r);
    let v = u.clone().multiply(new Vector3(1, 0, 1)); // direction of projection on plane
    return u.clone().projectOnVector(v);
  }
</script>

<!--Trail trajectory-->
{#each ts as [i, t]}
  {#if i != 0}
    <Line3D points={[getPoint(t, r), getPoint(ts[i - 1][1], r)]} color={trajectory_color_green} />
  {:else}
    <Line3D
      points={[getPoint(0, r), getPoint(ts[no_trajectory_points - 1][1], r)]}
      color={trajectory_color_green}
    />
  {/if}
{/each}

{#if reverse_in_red}
  {#each ts as [i, t]}
    {#if i != 0}
      <Line3D
        points={[
          getPoint(t, r).multiply(new Vector3(1, -1, 1)),
          getPoint(ts[i - 1][1], r).multiply(new Vector3(1, -1, 1))
        ]}
        color={trajectory_color_red}
      />
    {:else}
      <Line3D
        points={[
          getPoint(0, r).multiply(new Vector3(1, -1, 1)),
          getPoint(ts[no_trajectory_points - 1][1], r).multiply(new Vector3(1, -1, 1))
        ]}
        color={trajectory_color_red}
      />
    {/if}
  {/each}
{/if}

{#if trajectory_on_plane}
  {#each ts as [i, t]}
    {#if i != 0}
      <Line3D points={[proj_t_plane(t), proj_t_plane(ts[i - 1][1])]} color={traj_color_orng} />
    {:else}
      <Line3D
        points={[proj_t_plane(ts[0][1]), proj_t_plane(ts[no_trajectory_points - 1][1])]}
        color={traj_color_orng}
      />
    {/if}
  {/each}
{/if}
