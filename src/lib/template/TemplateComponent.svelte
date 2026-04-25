<script lang="ts">
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { Vector2 } from 'three';
  import {
    AbstractFunctionFragment,
    Angle,
    AsymptoteFragment,
    Circle,
    FunctionFragment,
    ImplicitFunctionFragment,
    LineFragment,
    ParameterizedFunctionFragment,
    Point,
    Polygon,
    Text,
    type AppletObject
  } from './TemplateAppletObjects';
  import Point2D from '$lib/d3/Point2D.svelte';
  import ImplicitFunction2D from '$lib/d3/ImplicitFunction2D.svelte';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import Polygon2D from '$lib/d3/Polygon2D.svelte';

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
  {:else if object instanceof Text}
    <Latex2D
      position={object.position}
      latex={object.latex}
      color={object.color.toString()}
      alignX={object.alignment?.alignX}
      alignY={object.alignment?.alignY}
    />
  {:else if object instanceof Angle}
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

    {#if object.latex}
      {@const v = object.position
        .clone()
        .add(object.getVectors()[0].add(object.getVectors()[1]).divideScalar(5.5))}
      {@const isVertical = Math.abs(v.x - object.position.x) < 1e-6}
      {@const alignX = Math.abs(v.x) < 1e-6 ? 'center' : v.x > 0 ? 'left' : 'right'}
      {@const alignY = Math.abs(v.y) < 1e-6 ? 'center' : v.y > 0 ? 'bottom' : 'top'}
      {@const offset = isVertical
        ? new Vector2(alignX === 'right' ? -0.08 : 0.08, 0)
        : new Vector2(0, 0)}
      <Latex2D
        latex={object.latex}
        position={v}
        color={object.color.toString()}
        {alignY}
        {alignX}
        {offset}
      />
    {/if}
  {:else if object instanceof Point}
    <Point2D position={object.position} color={object.color.toString()} shape={object.shape} />
    {#if object.latex}
      <Latex2D position={object.position} latex={object.latex} color={object.color.toString()} />
    {/if}
  {:else if object instanceof LineFragment}
    <Line2D
      start={object.startPoint}
      end={object.endPoint}
      color={object.color.toString()}
      isDashed={object.isDashed}
    />
    {#if object.latex}
      {@const v = object.midpoint()}
      {@const isVertical = Math.abs(object.endPoint.x - object.startPoint.x) < 1e-6}
      {@const alignX =
        object.latexAlign?.alignX ?? (Math.abs(v.x) < 1e-6 ? 'center' : v.x > 0 ? 'left' : 'right')}
      {@const alignY =
        object.latexAlign?.alignY ?? (Math.abs(v.y) < 1e-6 ? 'center' : v.y > 0 ? 'bottom' : 'top')}
      {@const offset =
        !object.latexAlign?.alignX && isVertical
          ? new Vector2(alignX === 'right' ? -0.08 : 0.08, 0)
          : new Vector2(0, 0)}
      <Latex2D
        position={v}
        {offset}
        latex={object.latex}
        color={object.color.toString()}
        {alignX}
        {alignY}
      />
    {/if}
  {:else if object instanceof Circle}
    <Circle2D
      position={object.origin}
      radius={object.radius}
      color={object.color.toString()}
      isDashed={object.isDashed}
    />
    {#each object.radiiShown as angle, i (i)}
      {@const endPoint = object.origin
        .clone()
        .addScaledVector(new Vector2(Math.cos(angle), Math.sin(angle)), object.radius)}
      <Line2D
        start={object.origin}
        end={endPoint}
        color={object.color.toString()}
        isDashed={object.isDashed}
      />
      {#if object.radiusLatex}
        {@const v = endPoint.clone().add(object.origin.clone()).divideScalar(2)}
        {@const isVertical = Math.abs(endPoint.x - object.origin.x) < 1e-6}
        {@const alignX = Math.abs(v.x) < 1e-6 ? 'center' : v.x > 0 ? 'left' : 'right'}
        {@const alignY = Math.abs(v.y) < 1e-6 ? 'center' : v.y > 0 ? 'bottom' : 'top'}
        {@const offset = isVertical
          ? new Vector2(alignX === 'right' ? -0.08 : 0.08, 0)
          : new Vector2(0, 0)}
        <Latex2D
          position={v}
          {offset}
          latex={object.radiusLatex}
          color={object.color.toString()}
          {alignX}
          {alignY}
        />
      {/if}
    {/each}
  {:else if object instanceof Polygon}
    <Polygon2D
      points={object.points}
      color={object.color.toString()}
      fillStyle={object.fillStyle}
    />
    {#each object.sideLatex as latex, i (i)}
      {@const pStart = object.points[i].clone()}
      {@const pEnd = object.points[(i + 1) % object.points.length].clone()}
      {@const v = pStart.add(pEnd).divideScalar(2)}
      {@const isVertical = Math.abs(pEnd.x - pStart.x) < 1e-6}
      {@const alignX = Math.abs(v.x) < 1e-6 ? 'center' : v.x > 0 ? 'left' : 'right'}
      {@const alignY = Math.abs(v.y) < 1e-6 ? 'center' : v.y > 0 ? 'bottom' : 'top'}
      {@const offset = isVertical
        ? new Vector2(alignX === 'right' ? -0.08 : 0.08, 0)
        : new Vector2(0, 0)}
      <Latex2D {latex} position={v} {offset} color={object.color.toString()} {alignX} {alignY} />
    {/each}
  {/if}
{/each}
