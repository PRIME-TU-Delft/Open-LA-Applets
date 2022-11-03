<script lang="ts">
  export let visible = true;
  export let column = false;
  export let styled = true;
  export let opacity = false;

  export let top: boolean = false;
  export let bottom: boolean = false;
  export let right: boolean = false;
  export let left: boolean = false;

  function calculateStyle(sides: [boolean, boolean, boolean, boolean]) {
    const [t, b, r, l] = sides;
    const len = sides.reduce((a, b) => a + (b ? 1 : 0), 0);

    if (len >= 3 || len == 0 || (t && b) || (r && l)) {
      // TODO: Throw error
      return 'display: none;';
    }

    let style = t ? 'top: 0;' : 'bottom: 0;';

    if (len == 1 && (t || b)) {
      style += 'right: 4rem;';
    }

    if (len == 2) {
      if (r) style += 'right: 0;';
      if (l) style += 'left: 0;';
    }

    return style;
  }

  $: style = calculateStyle([top, bottom, right, left]);
</script>

{#if visible}
  <!-- UI -->
  <div
    class="UI absolute z-50 m-4 flex select-none items-center gap-2 transition-opacity duration-300"
    class:styled
    class:column
    class:opacity
    {style}
  >
    <slot />
  </div>
{/if}

<style lang="postcss">
  .opacity {
    @apply opacity-50;
  }

  .opacity:hover {
    @apply opacity-100;
  }

  .styled {
    @apply rounded bg-slate-900 px-4 py-2 text-white;
    min-height: 3rem;
  }

  .column {
    flex-direction: column;
  }
</style>
