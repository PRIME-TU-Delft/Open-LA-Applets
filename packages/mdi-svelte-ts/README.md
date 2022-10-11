# Material design icons for Svelte (`typescript` support).

This repo is using isiration from the npm package [mdi-svelte](https://www.npmjs.com/package/mdi-svelte) by AlexxNB. This repo hasn't received an update since 29 Sep 2020. Svelte has been in heavy development since then. Furthermore, typescript is a must nowaday for developing a Svelte library. This was the main reason to create this repo.

This library is a simple wrapper for `@mdi/js` and thus supports all icons within that library. For more info can be found on their repo [mdi/js](https://github.com/Templarian/MaterialDesign-JS). This active repo keeps all icons from material design icons in a javascript format.

This component library is stable. However I'am planning to update this repo with more clear instruction on how to get started. For adding contrubutions take a look at [mdi-svelte-ts/issues](https://github.com/yustarandomname/mdi-svelte-ts/issues).

## Getting started

First install `mdi-svelte-ts` including @mdi/js.

```bash
yarn add mdi-svelte-ts @mdi/js
# or
npm install mdi-svelte-ts @mdi/js
```

to use the icons in your component

```html
<scrip lang="ts">
  import {mdiHeart} from "@mdi/js"
  import {Icon} from "mdi-svelte-ts"
</script>

<!-- Icon with width and height to be 2rem and spins 1 revolution per second -->
<Icon path={mdiHeart} size={2} spin={1}>
```

## For Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## For Building

To create a production version of your app:

```bash
npm run build
```
