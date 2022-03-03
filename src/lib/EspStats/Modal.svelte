<script lang="js">
  import _ from '../../utils/i18n';
  import { url } from '../../utils/store';
  import { getStats } from '../../utils/api';
  import { humanFileSize, calculateSize } from '../../utils/utils';

  import Icons from '../Icons/Icons.svelte';
  import Folder from './Folder.svelte';

  const circumference = 30 * 2 * Math.PI;

  let memory = 0;
  let usedMemory = 0;
  let percent = 0;
  let hotspot ='';
  let rssi = '';
  let ip = '';
  let files = [];

  window.addEventListener('hashchange', (event) => {
    if (event.newURL.includes('#esp-stats')) {
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

<div id="esp-stats" class="modal">
  <div class="modal-box">
    <div class="modal-content">
      <div class="flex justify-between">
        <h2 class="font-semibold text-xl mb-5">{$_('espStats')}</h2>
        <button
          class="btn btn-sm btn-circle btn-ghost drawer-button p-0"
          on:click|preventDefault="{() => window.history.go(-1)}"
        >
          <Icons cssClass="inline-block w-4 h-4 stroke-current" icon="close" />
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
