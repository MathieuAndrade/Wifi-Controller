<script lang="js">
  import Icon from '@iconify/svelte';
  import {
    ws,
    selectedLoco,
    indexOfSelectedLoco,
    powerState,
    addToast,
  } from '../../../utils/store';

  import _ from '../../../utils/i18n';
  import messages from '../../../utils/messages';

  import Gauge from '../../Gauge.svelte';
  import LocoFunctions from '../../LocoFunctions.svelte';

  let speed = 0;
  let dir = 1;
  let address = null;

  selectedLoco.subscribe(() => {
    address = $selectedLoco.address ? $selectedLoco.address : null;
  });

  const onSpeedChange = () => {
    if ($powerState && address) {
      $ws.send(messages.speed($indexOfSelectedLoco + 1, address, speed, dir));
    } else {
      speed = 0;
      addToast('warning', "L'alimentation est coupé");
    }
  };

  const onStop = () => {
    speed = -1;
    onSpeedChange();
  };

  const onChangeDirection = () => {
    dir = dir === 1 ? 0 : 1;
    onStop();
  };

  const onPower = () => {
    onStop();
    $powerState ? $ws.send(messages.powerOff()) : $ws.send(messages.powerOn());
    powerState.set(!$powerState);
  };
</script>

<div>
  <div class="flex flex-row space-x-7 justify-evenly">
    <div class="grow-0 hidden xl:block">
      <Gauge bind:speed onSpeedChange="{onSpeedChange}" />
    </div>
    <div class="grow-0 w-16">
      <input
        type="range"
        class="track-cursor w-80"
        data-orient="vertical"
        min="0"
        max="160"
        bind:value="{speed}"
        on:change="{onSpeedChange}" />
    </div>
    <div class="flex-auto grow-0 flex flex-col space-y-3">
      <div
        class="flex-auto flex flex-col place-items-center place-content-center space-y-3">
        {#if !$powerState}
          <span>{$_('stopedDcc')}</span>
          <img
            class="cursor-pointer"
            src="./images/carre-mecanique.png"
            alt=""
            width="120"
            height="120"
            on:click|preventDefault="{onPower}" />
        {:else}
          <span>{$_('freeWay')}</span>
          <img
            class="cursor-pointer"
            src="./images/voie-libre.png"
            alt=""
            width="84"
            height="178"
            on:click|preventDefault="{onPower}" />
        {/if}
      </div>
      <div class="flex flex-row space-x-2 justify-between">
        <button
          class="btn btn-outline btn-sm rounded-btn
          {dir === 1 ? '' : 'btn-accent'}"
          on:click|preventDefault="{onChangeDirection}">
          <Icon icon="eva:arrow-circle-left-outline" class="inline-block w-5 h-5 lg:mr-2" />
          <span class="hidden lg:block">{$_('forward')}</span>
        </button>

        <button
          class="btn btn-outline btn-sm rounded-btn
          {dir === 0 ? '' : 'btn-accent'}"
          on:click|preventDefault="{onChangeDirection}">
          <span class="hidden lg:block">{$_('backward')}</span>
          <Icon icon="eva:arrow-circle-right-outline" class="inline-block w-5 h-5 lg:ml-2" />
        </button>
      </div>

      <button
        class="btn btn-outline btn-sm btn-warning rounded-btn"
        on:click|preventDefault="{onStop}">
        <Icon icon="mdi:stop" class="inline-block w-5 h-5 lg:mr-2" />
        {$_('stop')}
      </button>
    </div>
  </div>

  <div
    class="rounded-box border border-base-300 p-5 mt-5 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      <LocoFunctions bind:address />
  </div>
</div>
