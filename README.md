# Open Linear Algebra Book Applets

This repository contains multiple packages and applications for the PRIME Graphics group. It hosts the code for the interactive applets in the [Open Linear Algebra Book](https://prime.pages.ewi.tudelft.nl/openlabook) by the Delft University of Technology. The applets are hosted here: https://openla.ewi.tudelft.nl. Documentation can be found here: https://docs.openla.ewi.tudelft.nl

## Getting started

We are using `pnpm` to install packages. To get started download [pnpm](https://pnpm.io/). Then run:

```bash
pnpm install
```

## What's inside?

### Apps

- `src/lib`: library with components for these applets
  - `/components`: UI components
  - `/d3-components`: 2D components create with D3.js
  - `/threlte-components`: 3D components create with threlte v5
  - `/utils`: Typescript functions used throughout the app

### Utilities

This repo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
