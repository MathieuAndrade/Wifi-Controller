<script lang="js">
  import Icon from '@iconify/svelte';
  import { locale } from 'svelte-i18n';

  import {
    event,
    hasDataToSave,
    locos,
    modalToOpen,
    powerState,
    url,
    ws,
  } from '../../utils/store';

  import { uploadFile } from '../../utils/api';
  import logger from '../../utils/log';
  import { downloadLocoInfosFiles, listOfLocoKeys } from '../../utils/utils';

  import _ from '../../utils/i18n';
  import messages from '../../utils/messages';

  locale.subscribe((value) => {
    console.log('locale changed to', value);
  });

  event.on('dccMessage', (data) => {
    if (data === '<p1>') {
      powerState.set(true);
    }

    if (data === '<p0>') {
      powerState.set(false);
    }
  });

  const onPower = () => {
    $powerState ? $ws.send(messages.powerOff()) : $ws.send(messages.powerOn());
    powerState.set(!$powerState);
  };

  const openLogsView = () => {
    window.open('#/logs', 'DCC logs', 'width=700, height=515');
  };

  const openDMCView = () => {
    window.open('#/mobile', '_blank').focus();
  };

  const onSave = async () => {
    try {
      const data = new File(
        [JSON.stringify($locos, listOfLocoKeys)],
        'locos.json',
        { type: 'application/json' },
      );
      await uploadFile($url, data, 'locos.json');
      hasDataToSave.set(false);
    } catch (error) {
      logger.error(error);
    }
  };
</script>

<div
  class="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-200 text-base-content">
  <nav class="navbar w-full">
    <div class="flex flex-1 md:gap-1 lg:gap-2">
      <span
        class="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]"
        data-tip="Menu">
        <label
          for="dashboard-drawer"
          class="btn btn-square btn-ghost drawer-button lg:hidden">
          <Icon icon="ic:round-menu" class="w-6 h-6" />
        </label>
      </span>

      <div class="flex items-center gap-2 lg:hidden">
        <span class="text-lg font-bold"> WDD </span>
      </div>

      <label class="swap btn btn-ghost gap-1">
        <input type="checkbox" on:change="{onPower}" checked="{$powerState}" />
        <div class="swap-on">
          <span class="badge badge-success">{$_('statusOn')}</span>
        </div>
        <div class="swap-off">
          <span class="badge badge-error">{$_('statusOff')}</span>
        </div>
      </label>

      <div class="tooltip tooltip-bottom" data-tip="{$_('power')}">
        <button
          tabindex="0"
          class="btn btn-ghost gap-1 normal-case"
          on:click|preventDefault="{onPower}">
          <Icon icon="ic:round-power-settings-new" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <div class="flex-0">
      <div class="tooltip tooltip-bottom" data-tip="{$_('addLoco')}">
        <button
          tabindex="0"
          id="new-loco-button"
          class="btn btn-ghost gap-1 normal-case"
          on:click|preventDefault="{() => modalToOpen.set('newLoco')}">
          <Icon icon="cil:locomotive" class="w-6 h-6" />
        </button>
      </div>

      <div class="divider divider-horizontal"></div>

      <!--
      <div
        class="tooltip tooltip-bottom"
        data-tip="{$_('openDMCView')}">
        <button
          tabindex="0"
          class="btn btn-ghost gap-1 normal-case"
          on:click="{openDMCView}">
          <Icon icon="ic:baseline-smartphone" class="w-6 h-6" />
        </button>
      </div>
      -->

      <div class="tooltip tooltip-bottom" data-tip="{$_('espStats')}">
        <button
          tabindex="0"
          class="btn btn-ghost gap-1 normal-case"
          on:click|preventDefault="{() => modalToOpen.set('espStats')}">
          <Icon icon="material-symbols:query-stats-rounded" class="w-6 h-6" />
        </button>
      </div>

      <div class="tooltip tooltip-bottom" data-tip="{$_('openDCCLog')}">
        <button
          tabindex="0"
          class="btn btn-ghost gap-1 normal-case"
          on:click="{openLogsView}">
          <Icon icon="icon-park-outline:align-text-left-one" class="w-6 h-6" />
        </button>
      </div>

      <div class="divider divider-horizontal"></div>

      <div class="indicator">
        {#if $hasDataToSave === true}
          <div
            class="translate-xy-8 animate-pulse indicator-item badge badge-accent h-3 w-3 p-0">
          </div>
        {/if}
        <div class="tooltip tooltip-bottom" data-tip="{$_('saveConfig')}">
          <button
            tabindex="0"
            class="btn btn-ghost gap-1 normal-case
          {$hasDataToSave ? 'animate-pulse' : ''}"
            disabled="{!$hasDataToSave}"
            on:click|preventDefault="{onSave}">
            <Icon icon="ic:round-save-as" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <div class="tooltip tooltip-bottom" data-tip="{$_('downloadConfig')}">
        <button
          tabindex="0"
          class="btn btn-ghost gap-1 normal-case"
          on:click|preventDefault="{() => downloadLocoInfosFiles($locos)}">
          <Icon icon="ic:round-download" class="w-6 h-6" />
        </button>
      </div>

      <div title="Change Language" class="dropdown dropdown-end">
        <div tabindex="-1" class="btn btn-ghost gap-1 normal-case">
          <Icon icon="tabler:language" class="w-6 h-6" />
        </div>
        <div
          class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px mt-16 w-56 overflow-y-auto shadow-2xl">
          <ul class="menu menu-compact gap-1 p-3">
            <li>
              <button
                class="flex {$locale.includes('fr') ? 'active' : ''}"
                on:click|preventDefault="{() => locale.set('fr')}">
                <Icon icon="emojione-v1:flag-for-france" class="w-6 h-6" />
                <span class="flex flex-1 justify-between"> Français </span>
              </button>
            </li>
            <li>
              <button
                class="flex {$locale.includes('en') ? 'active' : ''}"
                on:click|preventDefault="{() => locale.set('en')}">
                <Icon
                  icon="emojione-v1:flag-for-united-kingdom"
                  class="w-6 h-6" />
                <span class="flex flex-1 justify-between"> English </span>
              </button>
            </li>
            <li>
              <button
                class="flex {$locale.includes('es') ? 'active' : ''}"
                on:click|preventDefault="{() => locale.set('es')}">
                <Icon icon="emojione-v1:flag-for-spain" class="w-6 h-6" />
                <span class="flex flex-1 justify-between"> Español </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</div>
