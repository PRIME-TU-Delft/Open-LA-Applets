<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  import Container from '../Container.svelte';

  export let title = '';
  export let defaultSize: [string, string] = ['50rem', '30rem'];
  export let code: SvelteComponent | null = null;

  let presets: string[] = []; // TODO: iphone y, desktop

  let sceneOffset: number;

  console.log({ code });
</script>

<div
  bind:offsetHeight="{sceneOffset}"
  style="--w: {defaultSize[0]}; --h: {defaultSize[1]}"
  class="container min-w-[20rem] absolute top-1/2 -translate-y-1/2 left-20 m-0 p-0 resize overflow-auto"
>
  <div class="bg-white rounded-lg h-full w-full m-0 p-0">
    <slot />
  </div>
</div>

{#if !!title || $$slots.docs}
  <!-- Helper content -->
  <div class="flex flex-col gap-4 pb-10">
    <!-- Make sure the rest of the relative positioned content is positioned below the scene -->
    <div style="margin-top: calc(50vh + {sceneOffset / 2}px );"></div>

    <Container visible="{!!title}">
      <h1 class="text-3xl">{title}</h1>
    </Container>

    <!-- DOCUMENTATION -->
    <Container visible="{$$slots.docs}">
      <slot name="docs" />
    </Container>

    <!-- TODO: TOGGLES -->

    <!-- CODE: auto populated by slotEl innerHTML -->
    <!-- <Container >
      {Code}
    </Container> -->
    <Container visible="{$$slots.code}">
      <slot name="code" />
    </Container>
  </div>
{/if}

<style>
  .container {
    width: var(--w);
    height: var(--h);
    min-height: 10rem;
  }
</style>
