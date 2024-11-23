<script lang="ts">
  import * as Button from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import type { Slider } from '$lib/controls/Slider.svelte';
  import { activityState } from '$lib/stores/activity.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Pause from 'lucide-svelte/icons/pause';
  import Play from 'lucide-svelte/icons/play';
  import Plus from 'lucide-svelte/icons/plus';
  import { generateUUID } from 'three/src/math/MathUtils.js';

  type SliderProps = {
    value: number;
    slider: Slider;
    isExpanded: boolean;
    playSpeed?: number;
    onStopChanging?: () => void;
    onStartChanging?: () => void;
    onExpand?: () => void;
  };

  let {
    value = $bindable(),
    slider,
    isExpanded = false,
    playSpeed = 1000 / 16,
    onStopChanging,
    onStartChanging,
    onExpand
  }: SliderProps = $props();

  let uuid = generateUUID();

  let icon = $state('Play');
  let moveRight = $state(false); // direction of the slider
  let label = $derived(slider.valueFn(value));
  let isPlaying = $state(false); // is the slider playing

  // interval for playing the slider
  let playInterval: ReturnType<typeof setInterval> | undefined = $state();

  function round() {
    value = Math.round(value / slider.stepSize) * slider.stepSize;
  }

  function stopPlaying() {
    isPlaying = false;
    icon = 'Play';

    clearInterval(playInterval);
    round();
    slider.onRelease(value);

    if (onStopChanging) onStopChanging();
  }

  function startPlaying() {
    isPlaying = true;
    icon = 'Pause';

    playInterval = setInterval(() => {
      // console.log('is playing');
      // Bounce the slider back and forth
      value += ((moveRight ? -1 : 1) * slider.stepSize) / 4;

      if (slider.loop) {
        // Slider moves to min val
        if (slider.value >= slider.max) slider.value = slider.min;
        moveRight = false;
      } else {
        // Bounce the slider back and forth
        if (slider.value >= slider.max) {
          moveRight = true;
        } else if (slider.value <= slider.min) {
          moveRight = false;
        }
      }
    }, playSpeed);
  }

  function togglePlay() {
    if (isPlaying) {
      stopPlaying();
      slider.onRelease(slider.value);
    } else startPlaying();
  }

  function startChanging() {
    stopPlaying();

    if (onStartChanging) onStartChanging();
  }

  $effect(() => {
    if (!activityState.isActive) {
      setTimeout(() => {
        stopPlaying();
      }, 750);
    }
  });

  $effect(() => {
    if (!isExpanded) {
      stopPlaying();
    }
  });
</script>

{#if !isExpanded}
  <!-- If not selected display only the expand button -->
  <div class="tooltip tooltip-top" data-tip="Extend slider">
    <Button.Action
      class="text-white"
      --bg={slider.color}
      --hover-bg={slider.color + PrimeColor.opacity(0.8)}
      tooltip="Expand slider"
      side="top"
      onclick={() => (onExpand ? onExpand() : {})}
    >
      <Plus class="w-4 h-4" strokeWidth={3} />
    </Button.Action>
  </div>
{:else}
  <!-- If the slider is selected / expanded -->
  <Button.Action
    class="text-white rounded-full"
    --bg={slider.color}
    --hover-bg={slider.color + PrimeColor.opacity(0.8)}
    tooltip="Toggle animation"
    side="top"
    onclick={() => togglePlay()}
  >
    {#key icon}
      {#if icon === 'Play'}
        <Play class="w-4 h-4" fill="none" strokeWidth={3} />
      {:else}
        <Pause class="w-4 h-4" fill="white" strokeWidth={0} />
      {/if}
    {/key}
  </Button.Action>

  <div class="flex flex-col gap-1">
    {#if slider.label}
      <Label
        class="relative w-fit flex gap-1 items-center text-slate-700 text-xs pr-1"
        for="range-{uuid}"
        >{slider.label}:
        <p class="absolute left-full text-sm" style="color:{slider.color};">
          {label}
        </p>
      </Label>
    {/if}

    <input
      type="range"
      id="range-{uuid}"
      min={slider.min}
      max={slider.max}
      step={slider.stepSize}
      bind:value
      onchange={stopPlaying}
      onmousedown={startChanging}
      ontouchstart={startChanging}
      style="accent-color: {slider.color}"
    />
  </div>
{/if}
