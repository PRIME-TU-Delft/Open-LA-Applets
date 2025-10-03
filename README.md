# Open Linear Algebra Book and Calculus Applets

This repository contains multiple packages and applications for the PRIME Graphics group. It hosts the code for the interactive applets in the [Open Linear Algebra Book](https://interactivetextbooks.tudelft.nl/linear-algebra/) by the Delft University of Technology. The applets are hosted here: https://openla.ewi.tudelft.nl. Documentation can be found here: https://docs.openla.ewi.tudelft.nl

## Authoring applets

The applets are created using [Svelte](https://svelte.dev/) and [Threlte](https://threlte.xyz/) for 3D graphics.
You can find the source code for the applets in the [GitHub repository](https://github.com/PRIME-TU-Delft/Open-LA-Applets).

Create a new file in the `src/routes/applet/` folder with the convension of `SECTION_NAME_IN_THE_BOOK/APPLET_NAME/+page.svelte`.
Once created, run the following scripts:

```bash
pnpm install
pnpm dev # to run the app locally
```

Next, open `http://localhost:5173/` in your browser to see all the applets. Scroll through the applets to find your applet.
Alternatively, press `Command/Ctrl + K` to open the search window and find your applet.

Creating a new applet starts directly by making a tri-fold decision. First, do you want to make a 2D or 3D applet or both by using the split view? A [2D applets](https://docs.openla.ewi.tudelft.nl/?path=/docs/initialize-canvas2d--docs) uses SVG and D3.js to render the graphics, while a [3D applet](https://docs.openla.ewi.tudelft.nl/?path=/docs/initialize-canvas3d--docs) uses WebGL via Threlte or a [hybrid view](https://docs.openla.ewi.tudelft.nl/?path=/docs/initialize-splitcanvas2d--docs). Second, do you want to use controls like sliders and toggles? If so, you can read up on using these controls in the
[Controls](https://docs.openla.ewi.tudelft.nl/?path=/docs/initialize-controls--docs) and [Draggables](https://docs.openla.ewi.tudelft.nl/?path=/docs/initialize-draggables--docs) sections. Lastly, do you want to use formulas to display mathematical notation? If so, you can use the [Formulas](https://docs.openla.ewi.tudelft.nl/?path=/docs/initialize-formulas--docs) docs as a reference.

## Tutorials

You can find tutorials for creating 2D, 3D and split view applets here:

- [2D applets](https://docs.openla.ewi.tudelft.nl/?path=/docs/tutorial-2d--docs)
- [3D applets](https://docs.openla.ewi.tudelft.nl/?path=/docs/tutorial-3d--docs)

## Uploading applets

Once you are happy with your applet, you can make a pull request to the main branch. The applet will be automatically
deployed to `https://deploy-preview-[PR_NUMBER]--playful-otter-9e0500.netlify.app/`. Here you can test the applet in a production
environment, or share it with others for feedback. Once the pull request is merged, the applet will be automatically
deployed to `https://openla.ewi.tudelft.nl`.

## Embedding applets in the book

In the book of choice ([Open LA book](https://github.com/TUDelft-PRIME-Books/Linear-Algebra) or [Calculus](https://github.com/TUDelft-PRIME-Books/Calculus), etc.),
you can embed the applet using an iframe. You can find more information on how to do this in the
[Shinx PRIME applet documentation](https://github.com/TeachBooks/Sphinx-PRIME-applets). Your applet should be available with the following snippet:

````
```{applet}
:url: SECTION_NAME_IN_THE_BOOK/APPLET_NAME
:fig: Images/image_shown_in_print_version.svg
:name: name_that_is_used_to_refer_to_this_figure
:class: dark-light
:title: This title is shown when you full-screen the applet

A plane through the point $P$.
```
````

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
