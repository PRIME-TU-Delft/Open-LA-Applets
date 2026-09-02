<script lang="ts">
  import {
    AbstractFunctionFragment3D,
    AngleObject3D,
    PointObject3D,
    TextObject3D,
    VectorFieldObject3D,
    type AppletObject3D,
    InfiniteLineObject3D,
    LineSegmentObject3D,
    PolygonObject3D,
    CuboidObject3D,
    SurfaceFunction3D
  } from './TemplateAppletObjects3D';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Surface3D from '$lib/threlte/Surface3D.svelte';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import VectorField3D from '$lib/threlte/VectorField3D.svelte';
  import InfiniteLine3D from '$lib/threlte/InfiniteLine3D.svelte';
  import Line3D from '$lib/threlte/Line3D.svelte';
  import Polygon3D from '$lib/threlte/Polygon3D.svelte';
  import Cuboid3D from '$lib/threlte/Cuboid3D.svelte';

  let { objects }: { objects: AppletObject3D[] } = $props();
</script>

{#each objects as object, idx (idx)}
  {#if object instanceof AbstractFunctionFragment3D}
    {#if object instanceof SurfaceFunction3D}
      <Surface3D
        func={object.func}
        color={object.color.toString()}
        xRange={object.domain?.xRange}
        yRange={object.domain?.yRange}
        wireframe={object.wireframe}
      />
    {/if}
  {:else if object instanceof TextObject3D}
    <Latex3D
      latex={object.latex}
      position={object.position}
      color={object.color.toString()}
      fontSize={object.size}
    />
  {:else if object instanceof VectorFieldObject3D}
    <VectorField3D
      f={object.func}
      xRange={object.xRange}
      yRange={object.yRange}
      zRange={object.zRange}
    />
  {:else if object instanceof LineSegmentObject3D}
    {#if object instanceof InfiniteLineObject3D}
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
  {:else if object instanceof PolygonObject3D}
    <Polygon3D points={object.points} color={object.color.toString()} offset={object.offset} />
  {:else if object instanceof PointObject3D}
    <Point3D position={object.position} color={object.color.toString()} size={object.size} />
    {#if object.latex}
      <Latex3D position={object.position} latex={object.latex} color={object.color.toString()} />
    {/if}
  {:else if object instanceof AngleObject3D}
    <Angle3D
      vs={[object.startVector, object.endVector]}
      origin={object.position}
      color={object.color.toString()}
      size={object.size}
      title={object.latex}
    />
  {:else if object instanceof CuboidObject3D}
    <Cuboid3D
      color={object.color.toString()}
      corners={object.corners}
      toggleEdges={object.toggleEdges}
    />
  {/if}
{/each}
