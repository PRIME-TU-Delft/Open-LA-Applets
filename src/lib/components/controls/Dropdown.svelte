<script lang="ts">
  import { tick } from 'svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils/shadcn-utils.js';
  import { ArrowDownUp, Check } from 'lucide-svelte';
  import type { Dropdown } from '$lib/controls/Dropdown.svelte';

  type DropdownProps = {
    controller: Dropdown;
  };

  const { controller: dropdown }: DropdownProps = $props();

  let open = $state(false);

  const selectedValue = $derived(
    dropdown.values.find((f) => f === dropdown.value) ?? 'Select an item...'
  );

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class="w-[200px] justify-between"
      style="border-color: {dropdown.color}; background: {dropdown.color}10;"
    >
      {selectedValue}
      <ArrowDownUp class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search in items..." class="h-9" />
      <Command.Empty>No items found.</Command.Empty>
      <Command.Group>
        {#each dropdown.values as value}
          <Command.Item
            {value}
            onSelect={(currentValue) => {
              dropdown.value = currentValue;
              closeAndFocusTrigger(ids.trigger);
            }}
          >
            <Check class={cn('mr-2 h-4 w-4', value !== dropdown.value && 'text-transparent')} />
            {value}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
