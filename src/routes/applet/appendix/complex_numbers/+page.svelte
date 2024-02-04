<script lang="ts">
  import { Canvas2D, Latex2D, Vector2D } from '$lib/d3-components';
  import Arc from '$lib/d3-components/Arc.svelte';
  import Draggable from '$lib/d3-components/Draggable.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let u = new Vector2(1, -2);
  let v = new Vector2(-3, 4);

  $: deltaAngle = (v.angle() - u.angle()).toFixed(3);
</script>

<Canvas2D
  showFormulasDefault
  formulas={[
    new Formula('u ' + u.angle().toFixed(3)),
    new Formula('v ' + v.angle().toFixed(3)),
    new Formula(deltaAngle)
  ]}
>
  <Draggable bind:position={u} id="u" color={PrimeColor.red} />
  <Draggable bind:position={v} id="v" color={PrimeColor.darkGreen} />

  <Vector2D direction={u} length={u.length()} color="red" />
  <Latex2D position={u} latex="u" />
  <Vector2D direction={v} length={v.length()} color="green" />
  <Latex2D position={v} latex="v" />

  <Arc points={[u, v]} hasHead />
  <Arc points={[v, u]} hasHead distance={1.6} />
</Canvas2D>
