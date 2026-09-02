<script lang="ts">
  import {
    AbstractFunctionFragment3,
    Angle3,
    Surface3,
    Point3,
    Text3,
    VectorField3,
    type AppletObject3D,
    InfiniteLine3,
    LineSegment3,
    Polygon3
  } from './TemplateAppletObjects3D';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Surface3D from '$lib/threlte/Surface3D.svelte';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import VectorField3D from '$lib/threlte/VectorField3D.svelte';
  import InfiniteLine3D from '$lib/threlte/InfiniteLine3D.svelte';
  import Line3D from '$lib/threlte/Line3D.svelte';
  import Polygon3D from '$lib/threlte/Polygon3D.svelte';

  let { objects }: { objects: AppletObject3D[] } = $props();
</script>

{#each objects as object, idx (idx)}
  {#if object instanceof AbstractFunctionFragment3}
    {#if object instanceof Surface3}
      <Surface3D
        func={object.func}
        color={object.color.toString()}
        xRange={object.domain?.xRange}
        yRange={object.domain?.yRange}
        wireframe={object.wireframe}
      />
    {/if}
  {:else if object instanceof Text3}
    <Latex3D
      latex={object.latex}
      position={object.position}
      color={object.color.toString()}
      fontSize={object.size}
    />
  {:else if object instanceof VectorField3}
    <VectorField3D
      f={object.func}
      xRange={object.xRange}
      yRange={object.yRange}
      zRange={object.zRange}
    />
  {:else if object instanceof LineSegment3}
    {#if object instanceof InfiniteLine3}
      <InfiniteLine3D
        origin={object.startPoint}
        direction={object.endPoint}
        color={object.color.toString()}
        isDashed={object.isDashed}
        radius={object.radius}
      />
    {:else}
      <Line3D
        origin={object.startPoint}
        endPoint={object.endPoint}
        color={object.color.toString()}
        isDashed={object.isDashed}
        radius={object.radius}
      />
    {/if}
  {:else if object instanceof Polygon3}
    <Polygon3D points={object.points} color={object.color.toString()} offset={object.offset} />
  {:else if object instanceof Point3}
    <Point3D position={object.position} color={object.color.toString()} size={object.size} />
    {#if object.latex}
      <Latex3D position={object.position} latex={object.latex} color={object.color.toString()} />
    {/if}
  {:else if object instanceof Angle3}
    <Angle3D
      vs={[object.startVector, object.endVector]}
      origin={object.position}
      color={object.color.toString()}
      size={object.size}
      title={object.latex}
    />
  {/if}
{/each}
