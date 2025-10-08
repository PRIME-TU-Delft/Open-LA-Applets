<script module>
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Initialize/Controls',
    argTypes: {}
  });
</script>

<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const controls = Controls.addSlider(1, 0.5, 10, 0.5, PrimeColor.blue, {
    label: 'A',
    valueFn: (v) => round(v, 1).toString()
  });

  const multiControls = Controls.addSlider(1, 0.5, 10, 0.5, PrimeColor.blue, {
    label: 'A x',
    valueFn: (v) => round(v, 1).toString()
  }).addSlider(2, 0.5, 10, 0.5, PrimeColor.blue, {
    label: 'A y',
    valueFn: (v) => round(v, 1).toString()
  });

  const toggleControls = Controls.addToggle(true, 'A', PrimeColor.blue).addToggle(
    false,
    'B',
    PrimeColor.raspberry
  );

  const state = {
    aOpacity: 1,
    bPosition: new Vector2(2, 1)
  };

  type S = typeof state;

  const transitionSteps = [
    (t: number, state: S) => {
      state.aOpacity = state.aOpacity - 1 * t;
      return {
        state,
        labelNext: { en: 'fade out a', nl: 'vervagen a' },
        labelPrev: { en: 'Original state', nl: 'Oorspronkelijke staat' }
      };
    },
    (t: number, state: S) => {
      state.bPosition = state.bPosition.add(new Vector2(-3, 1).multiplyScalar(t));

      return {
        state,
        labelNext: { en: 'Move b to (-1,2)', nl: 'Verplaats b naar (-1,2)' },
        labelPrev: { en: 'Move b to (2,-1)', nl: 'Verplaats b naar (2,-1)' }
      };
    }
  ];

  const slideShowControl = Controls.addSlideShow(state, transitionSteps);
</script>

<!-- 
When the slider is changed, the `Vector2D` component will re-render with the new direction and length.

```typescript
const controls = Controls.addSlider(1, 0.5, 10, 0.5, PrimeColor.blue, 'A');
```

> `controls[0]` is automatically typed to `number` and can be used as a parameter for the `Vector2` constructor.
> When a user tries to access `controls[1]`, TypeScript will throw an error because the index is out of bounds.
-->
<Story name="One Slider">
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D {controls}>
      <Vector2D
        direction={new Vector2(controls[0], 2)}
        length={new Vector2(controls[0], 2).length()}
        color={PrimeColor.blue}
      />
    </Canvas2D>
  </div>
</Story>

<!-- 
```typescript
const controls = Controls.addSlider(1, 0.5, 10, 0.5, PrimeColor.blue, 'A');
```

Not more than 3 sliders are allowed in a single `Controls` instance. This is checked by a `isAllowedToAddControl`
function in the controls class.

| Control | Length |
|---------|--------|
| SlideShow       | 100     |
| Slider       | 30     |
| Dropdown       | 30     |
| Toggle       | 10     |
| Draggables       | 0     |

> The total length of the controls should not exceed 100 units.

```typescript
const multiControls = Controls.addSlider(1, 0.5, 10, 0.5, PrimeColor.blue, 'A x', (v) =>
    round(v, 1).toString()
  ).addSlider(2, 0.5, 10, 0.5, PrimeColor.blue, 'A y', (v) => round(v, 1).toString());
```
-->
<Story name="Multi Slider">
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D controls={multiControls}>
      <Vector2D
        direction={new Vector2(multiControls[0], multiControls[1])}
        length={new Vector2(multiControls[0], multiControls[1]).length()}
        color={PrimeColor.blue}
      />
    </Canvas2D>
  </div>
</Story>

<!-- 
```typescript
const toggleControls = Controls.addToggle(true, 'A', PrimeColor.blue).addToggle(
    false,
    'B',
    PrimeColor.raspberry
  );
```
 -->
<Story name="Toggles">
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D controls={toggleControls}>
      {#if toggleControls[1]}
        <Vector2D direction={new Vector2(-2, 1)} length={3} color={PrimeColor.raspberry} />
      {/if}
      {#if toggleControls[0]}
        <Vector2D direction={new Vector2(2, 1)} length={3} color={PrimeColor.blue} />
      {/if}
    </Canvas2D>
  </div>
</Story>

<!-- 
```typescript
const state = {
      aOpacity: 1,
      bPosition: new Vector2(2,1),
};

type S = typeof state;

const transitionSteps = [
  (t: number, state: S) => {
    state.aOpacity = state.aOpacity - 1 * t;
    return { state, labelNext: 'fade out a', labelPrev: 'Original state' };
  },
  (t: number, state: S) => {
    state.bPosition = state.bPosition.add(new Vector2(-3, 1).multiplyScalar(t));

    return { state, labelNext: 'Move b to (-1,2)', labelPrev: 'Move b to (2,-1)' };
  }
];

const slideShowControl = Controls.addSlideShow(state, transitionSteps);
```
 -->
<Story name="Slide show">
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D controls={slideShowControl}>
      {@const state = slideShowControl[0]}
      {#if state.aOpacity > 0.01}
        <Vector2D
          direction={new Vector2(-2, 1)}
          length={3}
          color={PrimeColor.raspberry + PrimeColor.opacity(state.aOpacity)}
        />
      {/if}
      <Vector2D
        direction={state.bPosition}
        length={state.bPosition.length()}
        color={PrimeColor.blue}
      />
    </Canvas2D>
  </div>
</Story>
