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
    const f2 = new Formula(`A = \\begin{pmatrix}\\$1 \\\\ \\$2 \\end{pmatrix}`)
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
  {#snippet template(_args)}
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
  {#snippet template()}
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
  const f2 = new Formula(`A = \\begin{pmatrix}\\$1 \\\\ \\$2 \\end{pmatrix}`)
    .addAutoParam(round(pos.x), PrimeColor.darkGreen)
    .addAutoParam(round(pos.y), PrimeColor.orange);
  return [f1, f2];
});
```
-->
<Story name="Auto parameter formulas">
  {#snippet template()}
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
  {#snippet template()}
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

<!-- `textColor` splits the formula's latex on "&" before wrapping it in `\textcolor{}`, so that a `\textcolor{}`
  group doesn't swallow an alignment marker meant for an outer `\begin{aligned}...\end{aligned}` block.

  KNOWN LIMITATION (undocumented behavior from PR #500, see issue #503): this only avoids swallowing the "&" — it
  does NOT keep the `\begin{aligned}`/`\end{aligned}` pair inside one `\textcolor{}` group. Since each split segment
  gets its own `\textcolor{}{...}` wrapper, `\begin{aligned}` ends up in a different group than its matching
  `\end{aligned}`, which KaTeX rejects ("Expected & or \\ or \cr or \end"). In practice this means: passing
  `textColor` to a `Formula` whose latex is a hand-written `\begin{aligned}...&...\end{aligned}` block throws at
  render time. `Formulas.align()` itself is unaffected, since it builds the `\begin{aligned}` block from already
  finished `Formula.latex` strings and never combines that with a `textColor` argument.

```typescript
// This combination currently throws a KaTeX parse error - do not use textColor together with
// a hand-written \begin{aligned}...&...\end{aligned} block:
// new Formula('\\begin{aligned} x &= 1 \\\\ y &= 2 \\end{aligned}', undefined, undefined, PrimeColor.raspberry);

// textColor works fine on formulas without "&":
const coloredFormula = new Formula('x = 1', undefined, undefined, PrimeColor.raspberry);
```
-->
<Story name="Formula with textColor">
  {#snippet template()}
    <div class="h-[300px] overflow-hidden rounded-lg">
      <Canvas2D
        {draggables}
        formulas={[
          new Formula(
            `\\text{length} = ${round(draggables[0].position.length())}`,
            undefined,
            undefined,
            PrimeColor.raspberry
          )
        ]}
      >
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
