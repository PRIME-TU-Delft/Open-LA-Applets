# Open Linear Algebra Book Applets

This repository contains multiple packages and applications for the PRIME Graphics group. It hosts the code for the interactive applets in the [Open Linear Algebra Book](https://interactivetextbooks.tudelft.nl/linear-algebra/) by the Delft University of Technology. The applets are hosted here: https://openla.ewi.tudelft.nl. Documentation can be found here: https://docs.openla.ewi.tudelft.nl

## Getting started

We are using `pnpm` to install packages. To get started download [pnpm](https://pnpm.io/). Then run:

```bash
pnpm install

# Then to run the app locally
pnpm dev
```

## What's inside?

### Apps

- `src/lib`: library with components for these applets
  - `/components`: UI components
  - `/controls`: Controls like draggables, sliders and toggles for the applets
  - `/d3`: 2D components created with D3.js
  - `store`: Where the global state is preserved
  - `/threlte`: 3D components created with threlte
  - `/utils`: Typescript functions used throughout the app

### Utilities

This repo has some additional tools already set-up for you:

- [TypeScript](https://www.typescriptlang.org/) for static type-checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

When debugging for performance, you can run the app with `pnpm dev:fps` to include an FPS counter in the corner of the scene.

## Url parameters

<!-- Autocomplete makes a mess out of this table :( -->

| Parameter | Description                                                                                                                                                                                                          | Default |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `iframe`  | This parameter is added by default and set to true for each applet in this book. Therefore, this parameter is not configurable for this book. When using an applet in a different context will change the bahaviour. | false   |
| `title`   | A string that will be shown as the title of the applet when the applet is in fullscreen mode                                                                                                                         | ""      |

### Control parameters

> [!WARNING]
> Work in progress

### 2D Specific parameters

> [!TIP]
> You should add split-\* before the parameter to make it apply to the right scene

| Parameter    | Description                                  | Default |
| ------------ | -------------------------------------------- | ------- |
| `position2D` | The position of the applet in the 2D scene   | 0,0     |
| `zoom2D`     | The zoom level of the applet in the 2D scene | 1       |

### 3D Specific parameters

> [!TIP]
> You should add split-\* before the parameter to make it apply to the right scene

| Parameter    | Description                                  | Default |
| ------------ | -------------------------------------------- | ------- |
| `position3D` | The position of the applet in the 3D scene   | 0,0,0   |
| `zoom3D`     | The zoom level of the applet in the 3D scene | 29      |
