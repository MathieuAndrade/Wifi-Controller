<script lang="js">
  import {
    ws,
    selectedLoco,
    indexOfSelectedLoco,
    powerState,
  } from '../../utils/store';

  import _ from '../../utils/i18n';
  import messages from '../../utils/messages';

  import Icons from '../Icons/Icons.svelte';
  import Gauge from '../Gauge.svelte';
  import Image from '../Image.svelte';
  import LocoFunctions from '../LocoFunctions.svelte';

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

<div
  class="collapse border rounded-box border-base-300 collapse-arrow {!$selectedLoco.address &&
    'collapse-close'}">
  <input type="checkbox" checked />

  <div class="collapse-title text-xl font-medium">
    {#if $selectedLoco && $selectedLoco.longName}
      {$_('loco')} : {$selectedLoco.longName}
    {:else if $selectedLoco && $selectedLoco.shortName}
      {$_('loco')} : {$selectedLoco.shortName}
    {:else}
      {$_('locoNotSelected')}
    {/if}
  </div>
  <div class="collapse-content flex flex-row space-x-7 justify-between">
    <div class="flex-auto flex flex-col space-y-5 items-center max-w-xs">
      <Image
        imgUrl="{$selectedLoco.imageUrl}"
        cssClass="border p-2 border-base-300 rounded-3xl shadow-lg max-h-44" />
      <div class="flex flex-col space-y-4">
        <div>
          <label class="basis-1/4 font-semibold" for="short-address">
            {$_('address')} :
          </label>
          <input
            class="input input-ghost input-bordered input-sm"
            type="number"
            id="address"
            name="address"
            bind:value="{address}"
            on:change="{() => (speed = 0)}" />
        </div>

        <p>
          <span class="font-semibold"> {$_('shortName')}: </span>
          {$selectedLoco.shortName}
        </p>
        <p>
          <span class="font-semibold"> {$_('longName')}: </span>
          {$selectedLoco.longName}
        </p>
      </div>
    </div>
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
    <div class="flex-auto grow-0 w-56 flex flex-col space-y-3">
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
          <Icons cssClass="inline-block w-5 lg:mr-2" icon="arrow-left" />
          <span class="hidden lg:block">{$_('forward')}</span>
        </button>

        <button
          class="btn btn-outline btn-sm rounded-btn
          {dir === 0 ? '' : 'btn-accent'}"
          on:click|preventDefault="{onChangeDirection}">
          <span class="hidden lg:block">{$_('backward')}</span>
          <Icons cssClass="inline-block w-5 lg:ml-2" icon="arrow-right" />
        </button>
      </div>

      <button
        class="btn btn-outline btn-sm btn-warning rounded-btn"
        on:click|preventDefault="{onStop}">
        <Icons cssClass="inline-block w-5 mr-2" icon="stop" />
        {$_('stop')}
      </button>
    </div>
    <div
      class="flex-auto rounded-box border border-base-300 p-5 max-w-sm min-w-[16rem]">
      <div class="max-h-72 overflow-auto">
        <LocoFunctions bind:address />
      </div>
    </div>
  </div>
</div>
