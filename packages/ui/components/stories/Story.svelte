<script lang="ts">
  import Container from '../Container.svelte';

  export let title = '';
  export let defaultSize: [string, string] = ['50rem', '30rem'];

  // let presets: string[] = []; // TODO: iphone y, desktop

  let sceneOffset = -300;
</script>

{#if $$slots.default}
  <div
    bind:offsetHeight="{sceneOffset}"
    style="--w: {defaultSize[0]}; --h: {defaultSize[1]}"
    class="container min-w-[20rem] absolute top-1/2 -translate-y-1/2 left-20 m-0 p-0 resize overflow-auto"
  >
    <div class="bg-white rounded h-full w-full m-0 p-0 overflow-hidden">
      <slot />
    </div>
  </div>
{/if}

{#if !!title || $$slots.docs}
  <!-- Helper content -->
  <div class="flex flex-col gap-4 pb-10">
    <!-- Make sure the rest of the relative positioned content is positioned below the scene -->
    <div style="margin-top: calc(50vh + {sceneOffset / 2}px );"></div>

    <Container visible="{!!title}">
      <h1 class="text-3xl">{title}</h1>
    </Container>

    <!-- DOCUMENTATION -->
    <Container visible="{!!$$slots.docs}">
      <div class="prose">
        <slot name="docs" />
      </div>
    </Container>

    <!-- CODE -->
    <Container visible="{!!$$slots.code}">
      <div class="prose">
        <slot name="code" />
      </div>
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
