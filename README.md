# Turborepo visuals

This repository contains multiple packages and applications for the PRIME Graphics group. It hosts the code for the interactive applets in the [Open Linear Algebra Book](https://dbalague.pages.ewi.tudelft.nl/openlabook/index.html) by the Delft University of Technology. The applets are hosted here: https://openla.ewi.tudelft.nl.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps

- `web`: a [svelte-kit](https://kit.svelte.dev/) app hosts the pages of the 3d & 2d visuals (applets)
  - `**/lib`: library with components for these applets
    - `/threlte-components`: 3D components create with threlte 5

### Packages

- `mdi-svelte-ts`: Components easy access to mdi icons
- `2d-components`: Components for 2d visuals
- `3d-components`: Components for 3d visuals
- `eslint-config-custom`: `eslint` configurations (includes `eslint-plugin-svelte` and `eslint-config-prettier`)

### Utilities

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).
This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
