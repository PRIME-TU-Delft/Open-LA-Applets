<script lang="ts">
  import { confettiState } from '$lib/stores/confetti.svelte';
  import { cn } from '$lib/utils/shadcn-utils';
  import Confetti from 'svelte-confetti';

  const { isSplit }: { isSplit: boolean } = $props();

  // Position the confetti on the left or right side of the screen
  const confettiClasses = $derived.by(() => {
    const base = 'absolute top-1/2 z-50';

    if (isSplit && confettiState.side) {
      return `${base} left-3/4`;
    } else if (!isSplit && confettiState.side) {
      return `${base} left-1/4`;
    } else if (confettiState.side) {
      return `${base} left-1/2`;
    } else {
      return '';
    }
  });

  // Use the derived value to update the class with cn utility
  const confettiClass = $derived(cn(confettiClasses));
</script>

<!-- @component
  @name Confetti
  @description
    A component that displays confetti on the screen.
  @props
    - {boolean} isSplit - Whether the confetti should be displayed on the left or right side of the screen.

  @example
    <Confetti isSplit={true} />
    
-->

<!-- CONFETTI -->
{#if confettiState.side != 'none'}
  <div class={confettiClass}>
    <Confetti duration={1500} amount={100} xSpread={0.4} rounded x={[-1.5, 1.5]} y={[-0.5, 1.5]} />
  </div>
{/if}
