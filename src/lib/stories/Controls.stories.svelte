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
  import { _ } from 'svelte-i18n';
  import Matrix2 from '$lib/utils/Matrix2.svelte';
  import { DiagonalMatrix } from '$lib/controls/DiagonalMatrix.svelte';

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
        labelNext: $_('applets.testing.controls_stories.fade_out_a'),
        labelPrev: $_('slideshow_original_state')
      };
    },
    (t: number, state: S) => {
      state.bPosition = state.bPosition.add(new Vector2(-3, 1).multiplyScalar(t));

      return {
        state,
        labelNext: $_('applets.testing.controls_stories.move_b_to'),
        labelPrev: $_('applets.testing.controls_stories.move_b_from')
      };
    }
  ];

  const slideShowControl = Controls.addSlideShow(state, transitionSteps);

  const dropdownVals = [
    'applets.testing.controls_stories.vector_left',
    'applets.testing.controls_stories.vector_right',
    'applets.testing.controls_stories.no_vector'
  ];
  const dropdownControl = Controls.addDropdown(dropdownVals[0], dropdownVals);

  const matrixControl = Controls.addMatrix(new Matrix2(1, 2, 3, 4), 'A', PrimeColor.blue).add(
    new DiagonalMatrix(new Matrix2(1, 0, 0, 3), 'B', PrimeColor.raspberry)
  );
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

<!-- 
```typescript
const dropdownVals = [
  'applets.testing.controls_stories.vector_left',
  'applets.testing.controls_stories.vector_right',
  'applets.testing.controls_stories.no_vector'
];
const dropdownControl = Controls.addDropdown(dropdownVals[0], dropdownVals);
```
 -->
<Story name="Dropdown">
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D controls={dropdownControl}>
      {#if dropdownControl[0] == dropdownVals[0]}
        <Vector2D direction={new Vector2(-2, 1)} length={3} color={PrimeColor.raspberry} />
      {/if}
      {#if dropdownControl[0] == dropdownVals[1]}
        <Vector2D direction={new Vector2(2, 1)} length={3} color={PrimeColor.blue} />
      {/if}
    </Canvas2D>
  </div>
</Story>

<!-- 
There are two types of Matrix controls - a normal matrix and a diagonal one which has the additional constraint that bottom right = top left.  

```typescript
const matrixControl = Controls.addMatrix(new Matrix2(1, 2, 3, 4), 'A', PrimeColor.blue).add(
  new DiagonalMatrix(new Matrix2(1, 0, 0, 1), 'B', PrimeColor.raspberry)
);
```
 -->
<Story name="Matrix">
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D controls={matrixControl}>
      <Vector2D
        direction={new Vector2(1, 1)}
        color={PrimeColor.blue}
        length={matrixControl[0].tl * matrixControl[0].br -
          matrixControl[0].tr * matrixControl[0].bl}
      />
      <Vector2D
        direction={new Vector2(-2, 3)}
        color={PrimeColor.raspberry}
        length={matrixControl[1].tl * matrixControl[1].br -
          matrixControl[1].tr * matrixControl[1].bl}
      />
    </Canvas2D>
  </div>
</Story>
