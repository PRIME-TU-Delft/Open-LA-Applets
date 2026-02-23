<script lang="ts">
  // For ease of creating the template applets
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import {
    AppletObject,
    AsymptoteFragment,
    FunctionFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const appletObjects: AppletObject[] = [
    new FunctionFragment((x: number) => x ** 2 - 2, PrimeColor.raspberry, { xMin: -1, xMax: 2.14 }),
    new FunctionFragment('\\frac{{x+1}^2}{x+1}', PrimeColor.blue).addGaps(new Vector2(-1, 0)),
    new FunctionFragment('e^x', PrimeColor.darkGreen).withIntegral({
      xLeft: -4,
      xRight: -1.25,
      fillStyle: 'full'
    }),
    new AsymptoteFragment(2, 'vertical', PrimeColor.cyan),
    new AsymptoteFragment(-1.5, 'horizontal', PrimeColor.black)
  ];
</script>

<TemplateComponent objects={appletObjects} />
