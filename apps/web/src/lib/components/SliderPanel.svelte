<script>
  export let isInset = false;
</script>

<div
  class="flex gap-1 p-3 bg-base-200 rounded-xl absolute bottom-0 right-20 lg:bottom-2 lg:right-20 transition-all items-center"
  class:inset={isInset}
>
  <slot />
</div>
