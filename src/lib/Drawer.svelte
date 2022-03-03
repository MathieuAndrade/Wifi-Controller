<script lang="js">
  import {
    url,
    ws,
    locos,
    selectedLoco,
    indexOfSelectedLoco,
    hasDataToSave,
    indexOfLocoToDelete,
  } from '../utils/store';
7
  import _ from '../utils/i18n';
  import { listOfLocoKeys, download } from '../utils/utils';
  import { uploadFile } from '../utils/api';
  import log from '../utils/log';

  import Icons from '../lib/Icons/Icons.svelte';
  import Image from './Image.svelte';

  const onChange = (event) => {
    indexOfSelectedLoco.set(event.currentTarget.value);
    selectedLoco.set($locos[event.currentTarget.value]);
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
      log.error(error);
    }
  };

  const onDelete = (index) => {
    indexOfLocoToDelete.set(index);
  };

  const openLogsView = () => {
    window.open('/logs', 'DCC logs', 'width=700, height=420');
  };
</script>

<div class="flex-grow drawer h-full">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="h-full drawer-content">
    <slot />
  </div>

  <div class="drawer-side">
    <label for="drawer" class="drawer-overlay"></label>

    <div class="pr-6 pt-3 menu w-96 bg-base-100 text-base-content">
      <div class="header-container flex items-center justify-center p-2 pl-6">
        <span class="header-lg text-lg font-bold"> {$_('dashboardTitle')} </span>
      </div>

      <div class="divider my-0 ml-6"></div>

      <div class="form-control ml-6">
        <label for="address" class="label">
          <span class="label-text">{$_('ipAddress')} :</span>
        </label>
        <div class="relative">
          <input
            id="address"
            name="address"
            type="text"
            placeholder="192.168.0.155:81"
            class="w-full pr-16 input input-bordered input-sm
        {!$ws ? 'input-error' : 'input-success'}"
            bind:value="{$url}" />
          <button
            class="absolute top-0 right-0 rounded-l-none btn btn-sm btn-outline
        {!$ws ? 'btn-error' : 'btn-success'}">
            {!$ws ? `${$_('connect')}` : `${$_('connected')}`}
          </button>
        </div>
      </div>

      <button
        class="btn btn-outline btn-sm mt-4 ml-6"
        on:click|preventDefault="{() => download('locos.json', $locos)}">
        <Icons cssClass="inline-block w-5 mr-2" icon="download" />
        {$_('downloadConfig')}
      </button>

      <button
        class="{`btn btn-outline btn-sm mt-4 ml-6
        ${$hasDataToSave ? 'animate-pulse' : ''}`}"
        disabled="{!$hasDataToSave}"
        on:click|preventDefault="{onSave}">
        <Icons cssClass="inline-block w-5 mr-2" icon="save" />
        {$_('saveConfig')}
      </button>

      <div class="flex items-center space-x-2">
        <a
          id="esp-stats-button"
          href="#esp-stats"
          class="btn btn-sm btn-ghost btn-outline mt-4 ml-6">
          <Icons cssClass="inline-block w-5 mr-2" icon="stats" />
          {$_('espStats')}
        </a>

        <button
          class="btn btn-sm btn-ghost btn-outline mt-4 mr-6 flex-auto"
          on:click="{openLogsView}">
          <Icons cssClass="inline-block w-5 mr-2" icon="logs" />
          DCC log
        </button>
      </div>

      <div class="divider pl-6">{$_('locos')}</div>

      <a
        id="new-loco-button"
        href="#new-loco"
        class="btn btn-sm btn-ghost btn-outline mb-5 ml-6">
        {$_('addLoco')}
      </a>

      <ul class="menu overflow-y-auto text-base-content">
        {#each $locos as loco, index (index)}
          <li class="flex flex-row space-x-5 place-items-center">
            <label class="flex-auto cursor-pointer label">
              <Image imgUrl="{loco.imageUrl}" width="{70}" />
              <span class="label-text">{loco.shortName}</span>
              <input
                type="radio"
                name="opt"
                checked="{$indexOfSelectedLoco === index}"
                class="radio"
                on:change="{onChange}"
                value="{index}" />
            </label>
            <button
              class="btn btn-sm btn-outline btn-square no-padding"
              title={$_('deleteLoco')}
              on:click|preventDefault="{() => onDelete(index)}">
              <Icons
                cssClass="inline-block w-4 h-4 stroke-current"
                icon="trash" />
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
