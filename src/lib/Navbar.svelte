<script lang="js">
  import Icon from '@iconify/svelte';
  import { ws, event, hasDataToSave, powerState, log } from '../utils/store';

  import messages from '../utils/messages';
  import _ from '../utils/i18n';

  export let mode = 'dashboard';

  let current = -1;

  event.on('dccMessage', (data) => {
    log.set(data);
    if (data.includes('<a')) {
      current = parseInt(data.replace(/\D/g, ''));
    }

    if (data === '<p1>') {
      powerState.set(true);
    }

    if (data === '<p0>') {
      powerState.set(false);
    }
  });

  setInterval(() => {
    if ($powerState) {
      $ws.send(messages.current());
    }
  }, 60000);

  const onPower = () => {
    $powerState ? $ws.send(messages.powerOff()) : $ws.send(messages.powerOn());
    powerState.set(!$powerState);
  };

  const onEmergency = () => {
    $ws.send(messages.powerOff());
    powerState.set(false);
  };
</script>

<div
  class="navbar shadow-lg bg-base-200 text-neutral-content w-full sticky top-0 z-50">
  <div class="navbar-start max-w-[30%]">
    <div class="indicator">
      {#if $hasDataToSave === true}
        <div
          class="translate-xy-8 animate-pulse indicator-item badge badge-accent h-3 w-3 p-0">
        </div>
      {/if}
      <label for="drawer" class="btn btn-circle btn-ghost drawer-button">
        <Icon icon="ic:round-menu" class="w-6 h-6" />
      </label>
    </div>
    {#if mode === 'dmc'}
      <span class="text-lg font-bold"> DMC </span>
    {:else}
      <span class="text-lg font-bold"> WDD </span>
    {/if}
  </div>

  <div class="px-2 mx-2 flex items-center space-x-5 navbar-center">
    <button
      class="btn btn-outline btn-sm btn-warning rounded-btn"
      on:click|preventDefault="{onEmergency}">
      <Icon icon="ic:round-warning-amber" class="w-5 h-5 lg:mr-2" />
      <span class="hidden lg:block">{$_('emergencyStop')}</span>
    </button>
    <button
      class="btn btn-outline btn-sm rounded-btn"
      on:click|preventDefault="{onPower}">
      <Icon icon="ic:round-power-settings-new" class="w-5 h-5 lg:mr-2" />
      <span class="hidden lg:block">{$_('power')}</span>
    </button>

    {#if !$powerState}
      <span class="badge badge-error w-24">{$_('statusOff')}</span>
    {/if}

    {#if $powerState}
      <span class="badge badge-success w-24">{$_('statusOn')}</span>
    {/if}

    {#if mode === 'dashboard'}
      <span class="text-info">{$_('currentMain')} : {current} mA</span>
      <span class="text-info max-w-[11rem] truncate hidden lg:block">
        {$_('log')}: {$log}
      </span>
    {/if}
  </div>

  <div class="navbar-end max-w-[30%] hidden lg:block"></div>
</div>
