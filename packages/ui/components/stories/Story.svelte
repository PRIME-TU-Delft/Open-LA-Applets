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
    class="max md:max-w-[calc(100vw - 10rem)] container absolute top-1/2 m-0 min-w-[20rem] -translate-y-1/2 resize overflow-auto p-0 md:left-20"
  >
    <div class="m-0 h-full w-full overflow-hidden rounded bg-white p-0">
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
    max-width: calc(100vw - 2rem);
    margin: 0 1rem;
  }
</style>
