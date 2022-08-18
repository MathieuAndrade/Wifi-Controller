<script lang="js">
  import Icon from '@iconify/svelte';
  import _ from '../../utils/i18n';
  import { url, modalToOpen } from '../../utils/store';
  import { getStats } from '../../utils/api';
  import { humanFileSize, calculateSize } from '../../utils/utils';

  import Folder from './Folder.svelte';

  const circumference = 30 * 2 * Math.PI;

  let memory = 0;
  let usedMemory = 0;
  let percent = 0;
  let hotspot ='';
  let rssi = '';
  let ip = '';
  let files = [];

  modalToOpen.subscribe(async (value) => {
    if (value === 'espStats') {
      getStats($url).then((response) => {
        files = response.files;
        memory = response.totalSize;
        hotspot = response.hotspot;
        rssi = response.rssi;
        ip = response.ip;
        usedMemory = calculateSize(files);
        percent = Math.round((100 * usedMemory) / memory);
      });
    }
  });
</script>

<div class="modal {$modalToOpen === 'espStats' ? 'modal-open' : ''}">
  <div class="modal-box">
    <div class="modal-content">
      <div class="flex justify-between">
        <h2 class="font-semibold text-xl mb-5">{$_('espStats')}</h2>
        <button
          class="btn btn-sm btn-circle btn-ghost drawer-button p-0"
          on:click|preventDefault="{() => modalToOpen.set('')}"
        >
          <Icon icon="mdi:close" class="w-5 h-5" />
        </button>
      </div>

      <div class="flex flex-row justify-between">
        <div class="flex flex-col space-y-3">
          <span>{$_('availableMemory')}: {humanFileSize(memory)}</span>
          <span>{$_('usedMemory')}: {humanFileSize(usedMemory)}</span>
          <span>{$_('accesPoint')}: {hotspot}</span>
          <span>{$_('sinalQuality')}: {rssi}dbm</span>
          <span>{$_('ipAddress')}: {ip}</span>
        </div>

        <div
          class="inline-flex items-center justify-center overflow-hidden rounded-full"
        >
          <svg class="w-20 h-20 transform -rotate-90">
            <circle
              stroke-width="5"
              stroke="currentColor"
              fill="transparent"
              r="30"
              cx="40"
              cy="40"></circle>
            <circle
              class="text-accent"
              stroke-width="5"
              stroke-dasharray="{circumference}"
              stroke-dashoffset="{circumference -
                (percent / 100) * circumference}"
              stroke-linecap="round"
              stroke="currentColor"
              fill="transparent"
              r="30"
              cx="40"
              cy="40"></circle>
          </svg>
          <span class="absolute">{percent} %</span>
        </div>
      </div>

      <div class="divider">{$_('filesSavedOnEsp')}</div>

      <Folder name="root" bind:files expanded />
    </div>
  </div>
</div>
