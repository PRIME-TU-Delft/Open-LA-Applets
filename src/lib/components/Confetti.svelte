<script lang="ts">
  import { Vector2 } from 'three';
  import Confetti from './confetti/Confetti.svelte';
  import { confettiState } from '$lib/stores/confetti.svelte.js';

  const { isSplit }: { isSplit: boolean } = $props();
</script>

{#key confettiState.updateState}
  {#if confettiState.confettiSide == 'left' || (confettiState.confettiSide == 'center' && isSplit)}
    <Confetti
      particleCount={300}
      origin={new Vector2(0, window.innerHeight)}
      angle={-45}
      spread={35}
      force={50}
    />
  {:else if confettiState.confettiSide == 'right'}
    <Confetti
      particleCount={300}
      origin={new Vector2(window.innerWidth, window.innerHeight)}
      angle={180 + 45}
      spread={35}
      force={50}
    />
  {:else if confettiState.confettiSide == 'center'}
    <Confetti
      particleCount={300}
      origin={new Vector2(window.innerWidth / 2, window.innerHeight)}
      angle={-90}
      spread={80}
      force={30}
    />
  {/if}
{/key}
