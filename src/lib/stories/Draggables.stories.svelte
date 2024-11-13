<script module>
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Initialize/Draggables',
    component: Canvas2D,
    argTypes: {}
  });
</script>

<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { CanvasProps } from '../d3/Canvas2D.svelte';

  const draggables = [new Draggable(new Vector2(3, 1))];
  const multiDraggables = [new Draggable(new Vector2(3, 1)), new Draggable(new Vector2(-3, 1))];
  const multiColorDraggables = [
    new Draggable(new Vector2(3, 1), PrimeColor.darkGreen),
    new Draggable(new Vector2(-3, 1), PrimeColor.yellow)
  ];
  const labelDraggables = [
    new Draggable(new Vector2(3, 1), PrimeColor.darkGreen, 'A'),
    new Draggable(new Vector2(-3, 1), PrimeColor.yellow, '\\mathcal{B}')
  ];

  const defaultSnapDraggables = [
    new Draggable(new Vector2(3, 1), PrimeColor.darkGreen, 'A', Draggable.snapToGrid)
  ];

  function maxDistance(position: Vector2) {
    if (position.length() > 2) {
      return position.clone().normalize().multiplyScalar(2);
    }

    return position;
  }

  const customSnapDraggables = [
    new Draggable(new Vector2(1.5, 1), PrimeColor.raspberry, 'A', maxDistance)
  ];

  setTemplate(template);
</script>

{#snippet template(args: Omit<CanvasProps, 'children'>)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas2D {...args}>
      {#if args.draggables}
        {#each args.draggables as draggable, i}
          <Vector2D
            origin={new Vector2(0, 0)}
            direction={draggable.position}
            length={draggable.position.length()}
            color={PrimeColor.getColor(i)}
          />
        {/each}
      {/if}
    </Canvas2D>
  </div>
{/snippet}

<!-- Draggables is defined by

```typescript
const draggables = [new Draggable(new Vector2(3, 1))];
```
-->
<Story name="Default" args={{ draggables }} />

<!-- 
```typescript
const draggables = [
  new Draggable(new Vector2(3, 1)), 
  new Draggable(new Vector2(1, 3))
];
```
-->
<Story name="Multiple draggables" args={{ draggables: multiDraggables }} />

<!-- Defines the colour of the  pulsing circle. It can be useful 
 to distinguish multiple draggables apart from one another  
 
```typescript
const draggables = [
  new Draggable(new Vector2(3, 1), PrimeColor.darkGreen), 
  new Draggable(new Vector2(1, 3), PrimeColor.yellow)
];
```
 -->
<Story name="With color" args={{ draggables: multiColorDraggables }} />

<!-- Adds a label with latex to the end of the draggable
 
```typescript
const draggables = [
  new Draggable(new Vector2(3, 1), PrimeColor.darkGreen, 'A'),
  new Draggable(new Vector2(-3, 1), PrimeColor.yellow, '\\mathcal{B}')
]
```
-->
<Story name="With labels" args={{ draggables: labelDraggables }} />

<!-- Snaps the draggable to the grid

```typescript
const draggables = [
  new Draggable(new Vector2(3, 1), PrimeColor.darkGreen, 'A', Draggable.snapToGrid),
]
```
-->
<Story name="Default snap" args={{ draggables: defaultSnapDraggables }} />

<!-- Snaps the draggables in such a way that the distance from the origin is at most 2

```typescript
function maxDistance(position: Vector2) {
  if (position.length() > 2) {
    return position.clone().normalize().multiplyScalar(2);  
  }

  return position
}

const draggables = [
  new Draggable(new Vector2(1.5, 1), PrimeColor.raspberry, 'A', maxDistance),
]
```
-->
<Story name="Custom snap">
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas2D draggables={customSnapDraggables}>
      <circle r={2} fill={PrimeColor.yellow + PrimeColor.opacity(0.5)} />

      {#each customSnapDraggables as draggable, i}
        <Vector2D
          origin={new Vector2(0, 0)}
          direction={draggable.position}
          length={draggable.position.length()}
          color={PrimeColor.getColor(i)}
        />
      {/each}
    </Canvas2D>
  </div>
</Story>
