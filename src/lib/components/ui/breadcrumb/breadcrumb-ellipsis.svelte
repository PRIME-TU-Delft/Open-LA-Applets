<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { cn } from '$lib/utils.js';
  import { mdiDotsHorizontal } from '@mdi/js';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLSpanElement> & {
    el?: HTMLSpanElement;
  };

  export let el: $$Props['el'] = undefined;
  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<span
  bind:this={el}
  role="presentation"
  aria-hidden="true"
  class={cn('flex h-9 w-9 items-center justify-center', className)}
  {...$$restProps}
>
  <div class="outline-none" tabindex="-1">
    <Icon path={mdiDotsHorizontal} class="h-4 w-4" />
  </div>
  <span class="sr-only">More</span>
</span>
