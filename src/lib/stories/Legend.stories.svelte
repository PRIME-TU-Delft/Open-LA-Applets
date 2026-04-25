<script module>
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Initialize/Legend',
    component: Canvas2D,
    argTypes: {}
  });
</script>

<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { FillType, LegendItem, Shape } from '$lib/utils/Legend';

  const draggables = [new Draggable(new Vector2(3, 1), PrimeColor.blue, 'A')];

  const oneFormula = $derived.by(() => {
    const length = draggables[0].position.length();
    const f1 = new Formula(`\\text{length} = ${round(length)}`);
    return [f1];
  });
</script>

<!-- This story showcases how legend and formulas show together
```typescript
const legendItems = [new LegendItem("A", PrimeColor.blue)];
``` 
-->
<Story name="Legend with formulas">
  {#snippet template(_args)}
    <div class="h-[300px] overflow-hidden rounded-lg">
      <Canvas2D
        {draggables}
        formulas={oneFormula}
        legendItems={[new LegendItem('A', PrimeColor.blue)]}
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

<!-- 
This story showcases multiple types of legend item fill styles
```typescript
const legendItems = [
    new LegendItem('A', PrimeColor.blue), 
    new LegendItem('B', PrimeColor.raspberry, FillType.Border), 
    new LegendItem('C', PrimeColor.darkGreen, FillType.Dashed)
];
```
 -->
<Story name="Multiple legend items">
  {#snippet template(_args)}
    <div class="h-[300px] overflow-hidden rounded-lg">
      <Canvas2D
        legendItems={[
          new LegendItem('A', PrimeColor.blue),
          new LegendItem('B', PrimeColor.raspberry, Shape.Circle, FillType.Border),
          new LegendItem('C', PrimeColor.darkGreen, Shape.Circle, FillType.Dashed)
        ]}
      >
        <Vector2D
          origin={new Vector2(0, 0)}
          direction={new Vector2(1, 1)}
          length={1}
          color={PrimeColor.blue}
        />
        <Vector2D
          origin={new Vector2(0, 0)}
          direction={new Vector2(0, 1)}
          length={1}
          color={PrimeColor.raspberry}
        />
        <Vector2D
          origin={new Vector2(0, 0)}
          direction={new Vector2(1, -1)}
          length={1}
          color={PrimeColor.darkGreen}
        />
      </Canvas2D>
    </div>
  {/snippet}
</Story>
