<script lang="ts">
  import * as Button from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import type { Slider } from '$lib/controls/Slider.svelte';
  import { activityState } from '$lib/stores/activity.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import ChevronsLeftRight from '@lucide/svelte/icons/chevrons-left-right';
  import ChevronsRightLeft from '@lucide/svelte/icons/chevrons-right-left';
  import Pause from '@lucide/svelte/icons/pause';
  import Play from '@lucide/svelte/icons/play';
  import { generateUUID } from 'three/src/math/MathUtils.js';
  import { locale, _ } from 'svelte-i18n';
  import { getLocalizedString } from '$lib/utils';

  type SliderProps = {
    value: number;
    slider: Slider;
    isExpanded: boolean;
    playSpeed?: number;
    onStopChanging?: () => void;
    onStartChanging?: () => void;
    onExpand?: () => void;
    onMinimize?: () => void;
  };

  let {
    value = $bindable(),
    slider,
    isExpanded = false,
    playSpeed = 1000 / 16,
    onStopChanging,
    onStartChanging,
    onExpand = () => {},
    onMinimize = () => {}
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
  <div class="tooltip tooltip-top" data-tip={$_('slider_expand')}>
    <Button.Action
      class="text-white"
      --bg={slider.color}
      --hover-bg={slider.color + PrimeColor.opacity(0.8)}
      tooltip={$_('slider_expand')}
      side="top"
      onclick={onExpand}
    >
      <ChevronsLeftRight class="h-4 w-4" strokeWidth={3} />
    </Button.Action>
  </div>
{:else}
  <!-- If the slider is selected / expanded -->
  <Button.Action
    class="relative rounded-full text-white"
    --bg={slider.color}
    --hover-bg={slider.color + PrimeColor.opacity(0.8)}
    tooltip={$_('slider_toggle_animation')}
    side="top"
    onclick={togglePlay}
  >
    {#key icon}
      {#if icon === 'Play'}
        <Play class="h-4 w-4" fill="none" strokeWidth={3} />
      {:else}
        <Pause class="h-4 w-4" fill="white" strokeWidth={0} />
      {/if}
    {/key}

    <Button.Action
      class="group absolute top-8 -right-2 size-5 rounded-full text-blue-950/50 transition-transform hover:scale-120"
      --bg="color-mix(in oklab, var(--color-blue-200) 95%, transparent)"
      --hover-bg="var(--color-blue-100)"
      tooltip={$_('slider_minimize')}
      onclick={onMinimize}
    >
      <ChevronsRightLeft class="size-4 group-hover:size-4" />
    </Button.Action>
  </Button.Action>

  {#if slider.label}
    <div class="mr-2 ml-4 flex flex-col">
      <Label
        class="relative flex w-fit items-center gap-1 pr-1 text-xs text-slate-700"
        for="range-{uuid}"
        >{getLocalizedString(slider.label, $locale)}:
        <p class="absolute left-full flex text-sm" style="color:{slider.color};">
          {#if slider.labelFormat}
            {@render slider.labelFormat(value)}
          {:else}
            {label}
          {/if}
        </p>
      </Label>
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
  {:else}
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
  {/if}
{/if}
