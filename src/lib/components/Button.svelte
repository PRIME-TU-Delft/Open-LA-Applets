<script lang="ts">
  import * as Button from '$lib/components/ui/button';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  type ButtonProps = {
    label: string;
    color: string;
    action: () => void;
  };

  let { label = 'Button', color = PrimeColor.blue, action = () => {} }: ButtonProps = $props();
</script>

<div class="tooltip tooltip-top" data-tip="Action for applet">
  <Button.Action
    class="text-white text-nowrap w-full p-2"
    --bg={color}
    --hover-bg={color + PrimeColor.opacity(0.8)}
    tooltip="Action for applet"
    side="top"
    onclick={() => action()}>{label}</Button.Action
  >
</div>
