<script lang="ts">
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { Vector2 } from 'three';
  import {
    AbstractFunctionFragment,
    AngleObject,
    AsymptoteFragment,
    FunctionFragment,
    ImplicitFunctionFragment,
    ParameterizedFunctionFragment,
    TextObject,
    type AppletObject
  } from './TemplateAppletObjects';
  import Point2D from '$lib/d3/Point2D.svelte';
  import ImplicitFunction2D from '$lib/d3/ImplicitFunction2D.svelte';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';

  let { objects }: { objects: AppletObject[] } = $props();
</script>

{#each objects as object, idx (idx)}
  {#if object instanceof AbstractFunctionFragment}
    {#if object instanceof ImplicitFunctionFragment}
      <ImplicitFunction2D
        zeroFunc={object.func}
        color={object.color.toString()}
        xMin={object.domain?.xMin}
        xMax={object.domain?.xMax}
        isDashed={object.isDashed}
      />
    {:else if object instanceof ParameterizedFunctionFragment}
      <ParameterizedFunction2D
        xFunc={object.xFunc}
        yFunc={object.yFunc}
        color={object.color.toString()}
        tStart={object.tDomain.start}
        tEnd={object.tDomain.end}
        isDashed={object.isDashed}
      />
    {:else if object instanceof FunctionFragment}
      <ExplicitFunction2D
        func={object.func}
        color={object.color.toString()}
        xMin={object.domain?.xMin}
        xMax={object.domain?.xMax}
        integral={object.integral
          ? {
              xLeft: object.integral?.xLeft,
              xRight: object.integral?.xRight,
              fillStyle: object.integral?.isDashed ? 'dashed' : 'full'
            }
          : undefined}
        isDashed={object.isDashed}
      />
    {/if}

    {#each object.gaps as position, idx (idx)}
      <Point2D
        {position}
        color={object.color.toString()}
        fill="white"
        radius={0.075}
        shape={object.shape}
      />
    {/each}
    {#each object.includedPoints as position, idx (idx)}
      <Point2D {position} color={object.color.toString()} radius={0.075} shape={object.shape} />
    {/each}
  {:else if object instanceof AsymptoteFragment}
    {#if object.type == 'vertical'}
      <InfiniteLine2D
        color={object.color.toString()}
        origin={new Vector2(object.position, 0)}
        direction={new Vector2(0, 1)}
        isDashed={true}
      />
    {:else}
      <InfiniteLine2D
        color={object.color.toString()}
        origin={new Vector2(0, object.position)}
        direction={new Vector2(1, 0)}
        isDashed={true}
      />
    {/if}
  {:else if object instanceof TextObject}
    <Latex2D
      position={object.position}
      latex={object.latex}
      color={object.color.toString()}
      alignX={object.alignment?.alignX}
      alignY={object.alignment?.alignY}
    />
  {:else if object instanceof AngleObject}
    {#if object.isRight()}
      <RightAngle2D
        color={object.color.toString()}
        origin={object.position}
        vs={object.getVectors()}
        size={object.distance}
      />
    {:else}
      <Angle2D
        origin={object.position}
        color={object.color.toString()}
        startAngle={object.startAngle}
        endAngle={object.endAngle}
        hasHead={object.hasHead}
        distance={object.distance}
      />
    {/if}
  {/if}
{/each}
