<script lang="ts">
  import { Vector3 } from 'three';
  import Line3D from './Line.svelte';
  import Arc3D from './Arc.svelte';
  import Label from './Label.svelte';

  export let vs: [Vector3, Vector3]; //vectors to draw angle between
  export let origin: Vector3 = new Vector3(0, 0, 0); //common orgin of vectors
  export let size = 0.3; //size of drawn angle
  export let color: string = 'black'; //color of used lines
  export let title = '';
  export let forceRightAngle = false; //if true draws a sharp angle, even if not 90 degrees
  export let forceRoundAngle = false; //if true draws a round angle, even if 90 degrees

  //resize vectors
  $: u1 = vs[0].clone().multiplyScalar(size / vs[0].length());
  $: u2 = vs[1].clone().multiplyScalar(size / vs[1].length());

  //labelPosition
  $: labelPosition = origin.clone().add(u1.clone()).add(u2.clone());
</script>

<!-- draw two lines to represent right angle if perpendicular, else draw an arc -->
{#if (Math.abs(u1.dot(u2)) <= 0.005 && !u1.equals(u2) && !forceRoundAngle) || forceRightAngle}
  <Line3D {color} points={[u1.clone().add(origin), u1.clone().add(u2).add(origin)]} />
  <Line3D {color} points={[u2.clone().add(origin), u1.clone().add(u2).add(origin)]} />
{:else if !vs[0].equals(vs[1])}
  <Arc3D points={[u1, u2]} color={'black'} {origin} pointsOnArc={25} />
{/if}

{#if title}
  <Label {color} position={labelPosition}>
    {title}
  </Label>
{/if}

<slot {labelPosition} />
