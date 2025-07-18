<script module>
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Initialize/Formulas',
    component: Canvas2D,
    argTypes: {}
  });
</script>

<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const draggables = [new Draggable(new Vector2(3, 1), PrimeColor.blue, 'A')];

  const oneFormula = $derived.by(() => {
    const length = draggables[0].position.length();
    const f1 = new Formula(`\\text{length} = ${round(length)}`);
    return [f1];
  });

  const multiFormula = $derived.by(() => {
    const pos = draggables[0].position;
    const length = pos.length();
    const f1 = new Formula(`\\text{length} = ${round(length)}`);
    const f2 = new Formula(`A = {x: ${round(pos.x)}, y: ${round(pos.y)}}`);
    return [f1, f2];
  });

  const autoParamFormula = $derived.by(() => {
    const pos = draggables[0].position;
    const length = pos.length();
    const f1 = new Formula(`\\text{length} = ${round(length)}`);
    const f2 = new Formula(`A = \\begin{bmatrix}\\$1 \\\\ \\$2 \\end{bmatrix}`)
      .addAutoParam(round(pos.x), PrimeColor.darkGreen)
      .addAutoParam(round(pos.y), PrimeColor.orange);
    return [f1, f2];
  });

  const formulaLeft = $derived([autoParamFormula[1]]);
  const formulaRight = $derived([autoParamFormula[0]]);
</script>

<!-- One formula
 
```typescript
const oneFormula = $derived.by(() => {
  const length = draggables[0].position.length();
  const f1 = new Formula(`\\text{length} = ${round(length)}`);
  return [f1];
});
```
-->
<Story name="One formula">
  {#snippet template(args)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D {draggables} formulas={oneFormula}>
      <Vector2D
        origin={new Vector2(0, 0)}
        direction={draggables[0].position}
        length={draggables[0].position.length()}
        color={PrimeColor.blue}
      />
    </Canvas2D>
  </div>
  {/snippet}
</Story>

<!-- Multi formulas 
 
```typescript
const multiFormula = $derived.by(() => {
  const pos = draggables[0].position;
  const length = pos.length();
  const f1 = new Formula(`\\text{length} = ${round(length)}`);
  const f2 = new Formula(`A = \{x: ${pos.x}, y: ${pos.y}\}`);
  return [f1, f2];
});
```
-->
<Story name="Multi formula">
  {#snippet template(args)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D {draggables} formulas={multiFormula}>
      <Vector2D
        origin={new Vector2(0, 0)}
        direction={draggables[0].position}
        length={draggables[0].position.length()}
        color={PrimeColor.blue}
      />
    </Canvas2D>
  </div>
  {/snippet}
</Story>

<!-- add auto parameter
 
```typescript
const autoParamFormula = $derived.by(() => {
  const pos = draggables[0].position;
  const length = pos.length();
  const f1 = new Formula(`\\text{length} = ${round(length)}`);
  const f2 = new Formula(`A = \\begin{bmatrix}\\$1 \\\\ \\$2 \\end{bmatrix}`)
    .addAutoParam(round(pos.x), PrimeColor.darkGreen)
    .addAutoParam(round(pos.y), PrimeColor.orange);
  return [f1, f2];
});
```
-->
<Story name="Auto parameter formulas">
  {#snippet template(args)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D {draggables} formulas={autoParamFormula}>
      <Vector2D
        origin={new Vector2(0, 0)}
        direction={draggables[0].position}
        length={draggables[0].position.length()}
        color={PrimeColor.blue}
      />
    </Canvas2D>
  </div>
  {/snippet}
</Story>

<!-- Split formulas

```typescript
const formulaLeft = $derived([autoParamFormula[1]]);
const formulaRight = $derived([autoParamFormula[0]]);
```
-->
<Story name="Split formulas">
  {#snippet template(args)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D {draggables} formulas={formulaLeft} splitFormulas={formulaRight}>
      <Vector2D
        origin={new Vector2(0, 0)}
        direction={draggables[0].position}
        length={draggables[0].position.length()}
        color={PrimeColor.blue}
      />

      {#snippet splitCanvas2DChildren()}
        <Vector2D
          origin={new Vector2(0, 0)}
          direction={draggables[0].position}
          length={draggables[0].position.length()}
          color={PrimeColor.blue}
        />
      {/snippet}
    </Canvas2D>
  </div>
  {/snippet}
</Story>
