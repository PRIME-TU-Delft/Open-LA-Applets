<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { cn } from '$lib/utils.js';
  import { mdiChevronRight } from '@mdi/js';
  import type { HTMLLiAttributes } from 'svelte/elements';

  type $$Props = HTMLLiAttributes & {
    el?: HTMLLIElement;
  };

  export let el: $$Props['el'] = undefined;
  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<li
  role="presentation"
  aria-hidden="true"
  class={cn('[&>svg]:size-3.5', className)}
  bind:this={el}
  {...$$restProps}
>
  <slot>
    <div tabindex="-1">
      <Icon path={mdiChevronRight} />
    </div>
  </slot>
</li>
