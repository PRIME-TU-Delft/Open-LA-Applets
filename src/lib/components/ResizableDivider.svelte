<script lang="ts">
  import { cn } from '$lib/utils';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { globalState } from '$lib/stores/globalState.svelte';

  let {
    onResize,
    minimumWidthPercent = 20,
    defaultLeftDivision = 50
  }: {
    onResize: (leftWidth: number) => void;
    minimumWidthPercent?: number;
    defaultLeftDivision?: number;
  } = $props();

  let isDragging = $state(false);
  let dividerRef: HTMLButtonElement;

  let defaultLeftWidth: number;

  onMount(() => {
    if (!dividerRef) return;
    const parent = dividerRef.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    defaultLeftWidth = (rect.width * defaultLeftDivision) / 100;
    onResize(defaultLeftWidth);
  });

  function reset() {
    onResize(defaultLeftWidth);
  }

  $effect(() => {
    const _ = globalState.resetKey;

    reset();
  });

  /**
   * Calculates the new left width based on client X position
   */
  function calculateLeftWidth(clientX: number): number | null {
    if (!dividerRef) return null;

    const parent = dividerRef.parentElement;
    if (!parent) return null;

    const rect = parent.getBoundingClientRect();
    let leftWidth = clientX - rect.left;
    const minimumWidth = (rect.width * minimumWidthPercent) / 100;

    // snapping
    const defaultWidth = (rect.width * defaultLeftDivision) / 100;
    const snapThreshold = rect.width * 0.01;
    if (Math.abs(leftWidth - defaultWidth) <= snapThreshold) {
      leftWidth = defaultWidth;
    }

    if (leftWidth >= minimumWidth && leftWidth <= rect.width - minimumWidth) {
      return leftWidth;
    }

    return null;
  }

  function handleMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;

    isDragging = true;
    e.preventDefault();
  }

  function handleTouchStart(e: TouchEvent) {
    isDragging = true;
    e.preventDefault();
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;

    const leftWidth = calculateLeftWidth(e.clientX);
    if (leftWidth !== null) {
      onResize(leftWidth);
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isDragging || e.touches.length === 0) return;

    const touch = e.touches[0];
    const leftWidth = calculateLeftWidth(touch.clientX);
    if (leftWidth !== null) {
      onResize(leftWidth);
    }
  }

  function handleEnd() {
    isDragging = false;
  }

  $effect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  });

  function handleDoubleClick() {
    if (!dividerRef) return;
    const parent = dividerRef.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const leftWidth = (rect.width * defaultLeftDivision) / 100;
    onResize(leftWidth);
  }
</script>

<button
  bind:this={dividerRef}
  type="button"
  tabindex="-1"
  aria-label="Resizable divider"
  class={cn(
    'relative flex h-full w-1.5 cursor-col-resize flex-col justify-around bg-slate-700 select-none',
    'group'
  )}
  onmousedown={handleMouseDown}
  ontouchstart={handleTouchStart}
  ondblclick={handleDoubleClick}
  title={$_('resize')}
>
  <div class="flex flex-col items-center justify-center">
    <svg width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="4" r="1.7" stroke="white" stroke-width="1.5" fill="white" />
      <circle cx="6" cy="12" r="1.7" stroke="white" stroke-width="1.5" fill="white" />
      <circle cx="6" cy="20" r="1.7" stroke="white" stroke-width="1.5" fill="white" />
    </svg>
  </div>

  <div class="flex flex-col items-center justify-center">
    <svg width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="4" r="1.7" stroke="white" stroke-width="1.5" fill="white" />
      <circle cx="6" cy="12" r="1.7" stroke="white" stroke-width="1.5" fill="white" />
      <circle cx="6" cy="20" r="1.7" stroke="white" stroke-width="1.5" fill="white" />
    </svg>
  </div>
</button>
