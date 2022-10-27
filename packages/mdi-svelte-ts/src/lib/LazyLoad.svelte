<script lang="ts">
  type T = $$Generic;

  export let items: T[] = [];
  export let page = 1;
  export let size = 50;

  $: pageItems = page ? items.slice(0, size * page) : [];

  /**
   * If the button is intersected in the viewport, load more items.
   * @param el: A button element.
   */
  function intersectObserver(el: HTMLButtonElement) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const intersecting = entry.isIntersecting;

        if (intersecting) page += 1;
      });
    });

    observer.observe(el);
  }
</script>

{#each pageItems as item, index}
  <slot {item} {index} />
{:else}
  <slot name="not-found">
    <p>Nothing found</p>
  </slot>
{/each}

{#if pageItems.length < items.length}
  <button use:intersectObserver on:click={() => page++}>Load more</button>
{/if}
