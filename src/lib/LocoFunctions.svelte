<script lang="js">
  import messages from '../utils/messages';
  import { powerState, selectedLoco, ws } from '../utils/store';
  import { getFuncBytes, listOfLocoFunctions } from '../utils/utils';

  export let address = null;

  let funcState = new Array(28).fill(0);

  const onFuncStateChange = (func) => {
    if ($powerState && address) {
      const { byte1, byte2 } = getFuncBytes(funcState, func);
      $ws.send(messages.function(address, byte1, byte2));
    } else {
      funcState[func] = false;
    }
  };
</script>

{#each listOfLocoFunctions as func}
  <label class="cursor-pointer label justify-start gap-4">
    <input
      id="command-{func}"
      name="command-{func}"
      type="checkbox"
      class="toggle toggle-accent"
      default="false"
      bind:checked="{funcState[func]}"
      on:change="{() => onFuncStateChange(func)}" />
    <span class="label-text">
      {#if $selectedLoco && $selectedLoco[func]}
        {$selectedLoco[func]}
      {:else}
        F{func}
      {/if}
    </span>
  </label>
{/each}
