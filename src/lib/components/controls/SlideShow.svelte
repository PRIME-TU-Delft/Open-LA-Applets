<script lang="ts" generics="State">
  import * as Button from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import type { SlideShow } from '$lib/controls/SlideShow.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import { scale } from 'svelte/transition';
  import { generateUUID } from 'three/src/math/MathUtils.js';
  import { locale, _ } from 'svelte-i18n';
  import { getLocalizedString } from '$lib/utils';

  type SlideShowProps = {
    controller: SlideShow<State>;
  };

  let { controller }: SlideShowProps = $props();
  let uuid = generateUUID();
</script>

<Label class="inline-flex items-center" for="checkbox-{uuid}">
  {#if controller.label != undefined}
    <span>{getLocalizedString(controller.label, $locale)}</span>
  {/if}
</Label>

{#if controller.hasPrev()}
  <div in:scale>
    <Button.Action
      class="rounded-full text-white"
      --bg={PrimeColor.darkGreen}
      --hover-bg={PrimeColor.darkGreen + PrimeColor.opacity(0.8)}
      tooltip={$_('slideshow_prev')}
      side="top"
      onclick={() => controller.prev()}
    >
      <ChevronLeft class="h-4 w-4" />
    </Button.Action>
  </div>
{/if}

{#if controller.hasNext()}
  <div in:scale>
    <Button.Action
      class="rounded-full text-white"
      --bg={PrimeColor.darkGreen}
      --hover-bg={PrimeColor.darkGreen + PrimeColor.opacity(0.8)}
      tooltip={$_('slideshow_next')}
      side="top"
      onclick={() => controller.next()}
    >
      <ChevronRight class="h-4 w-4" />
    </Button.Action>
  </div>
{/if}
