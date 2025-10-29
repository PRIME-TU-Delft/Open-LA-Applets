<script lang="ts">
  import { cn } from '$lib/utils';
  import { _ } from 'svelte-i18n';

  let {
    onResize,
    minimumWidthPercent = 20
  }: {
    onResize: (leftWidth: number) => void;
    minimumWidthPercent?: number;
  } = $props();

  let isDragging = $state(false);
  let dividerRef: HTMLButtonElement;

  /**
   * Calculates the new left width based on client X position
   */
  function calculateLeftWidth(clientX: number): number | null {
    if (!dividerRef) return null;

    const parent = dividerRef.parentElement;
    if (!parent) return null;

    const rect = parent.getBoundingClientRect();
    const leftWidth = clientX - rect.left;
    const minimumWidth = (rect.width * minimumWidthPercent) / 100;

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
</script>

<button
  bind:this={dividerRef}
  type="button"
  tabindex="-1"
  aria-label="Resizable divider"
  class={cn(
    'relative -ml-1 flex h-full w-1.5 cursor-col-resize flex-col justify-around bg-slate-700 select-none',
    'group'
  )}
  onmousedown={handleMouseDown}
  ontouchstart={handleTouchStart}
  title={$_('resize')}
>
  <span
    class="-ml-1.75 h-auto w-full stroke-white text-3xl text-white"
    style="writing-mode: vertical-lr;">...</span
  >
  <span
    class="-ml-1.75 h-auto w-full stroke-white text-3xl text-white"
    style="writing-mode: vertical-lr;">...</span
  >
</button>
