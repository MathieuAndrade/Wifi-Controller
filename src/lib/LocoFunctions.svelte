<script lang="js">
  import { ws, selectedLoco, powerState } from '../utils/store';
  import { listOfLocoFunctions, getFuncBytes } from '../utils/utils';
  import messages from '../utils/messages';

  export let address = null;

  let funcState = [];

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
  <label class="cursor-pointer label">
    <span class="label-text">
      {#if $selectedLoco && $selectedLoco[func]}
        {$selectedLoco[func]}
      {:else}
        F{func}
      {/if}
    </span>
    <input
      id="command-{func}"
      name="command-{func}"
      type="checkbox"
      class="toggle toggle-accent"
      default="false"
      bind:checked="{funcState[func]}"
      on:change="{() => onFuncStateChange(func)}"
    />
  </label>
{/each}
