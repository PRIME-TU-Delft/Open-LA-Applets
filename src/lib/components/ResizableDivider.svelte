<script lang="ts">
  import { cn } from '$lib/utils';

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
    'relative -ml-1 flex h-full w-2 flex-shrink-0 cursor-col-resize items-center justify-center border-r-4 border-slate-400 bg-transparent select-none',
    'group'
  )}
  onmousedown={handleMouseDown}
  ontouchstart={handleTouchStart}
>
  <div
    class={cn(
      'pointer-events-none h-10 w-0.5 rounded-sm bg-slate-400 transition-all duration-200',
      'group-hover:w-1 group-hover:bg-blue-500',
      isDragging && 'w-1 bg-blue-500'
    )}
  ></div>
</button>
