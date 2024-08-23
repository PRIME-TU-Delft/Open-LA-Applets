# TODOS

- [ ] Share -> Embed link is broken

# Overal changes

- Better and more consistant url parameters see [readme](./README.md?tab=readme-ov-file#url-parameters)
- bind:controls -> {controls}
- Clicking reset will animate sliders and subsequent changes back to the initial state
- Reset and pause are now two different things
  - reset -> resets the scene to the initial state
  - pause -> pauses the scene and allows for scrolling
- Pause is now called `Lock/unlock` to better represent the functionality
- AbstractCanvas component is now Scene component

## Renames

- `d3-components` folder is now `d3`
- `threlte-components` folder is now `threlte`
- `activityStore.ts` is now `activity.svelte.ts`
- `globalState.ts` is now `globalState.svelte.ts`

## breaking changes in 3D

### Canvas3D

- It is no longer possible to set custom lights
- Colours are the same as 2D colours

### Axis3D

- AxisSpacing is no longer reliable on zoom level
- No longer is origin >30x rendered
- A gizmo can be added to the axis for orientation

### Latex3D

- Prop `extend` (vector) has become -> offset (vector) and extend (number)
- Prop `size` (number) -> `fontSize` (number)

### Line3D

- points ([Vector3, Vector3]) -> origin (Vector3) and endPoint (Vector3)

### Vector3D

- isAlwaysOnTop is now also applicable to the head of the vector
- radius is resized
- cone head now scales with radius
- striped -> isDashed
- let:endPoint is now accesible via `{#snippet children(endPoint)}`
- `noNormalise` prop is added to prevent normalisation of the vector

---

---

## Breaking changes in 2D

- Colours are more vibrant and closer to the 2D colour set

### Canvas2D:

- It is no longer possible to set custom lights for 3D scenes
- <svelte:template name="splitCanvas"> -> {#snippet splitCanvas2DChildren()}
- <svelte:template name="splitCanvas3d"> -> {#snippet splitCanvas3DChildren()}

### Vector2D:

- let:endPoint is now accesible via `{#snippet children(endPoint)}`
- `noNormalise` prop is added to prevent normalisation of the vector

### Draggables2D

- draggables are now part of controls and can be added to the canvas by using the `controls` prop
- snap is now a function that is passed in the controls
  - snap: (point: Vector2) => Vector2
  - The default snap function can be found by importing `Draggable.snapToGrid`

### Latex2D

- No longer uses mathjax but is now rendered with katex
- `size` (number) -> `fontSize` (number)
