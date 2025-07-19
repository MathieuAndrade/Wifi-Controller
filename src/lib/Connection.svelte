<script lang="js">
  import Icon from '@iconify/svelte';

  import { getLocos } from '../utils/api';
  import _ from '../utils/i18n';
  import log from '../utils/log';
  import websocket from '../utils/websocket';

  import {
    event,
    indexOfSelectedLoco,
    locos,
    modalToOpen,
    powerState,
    selectedLoco,
    url,
    ws,
  } from '../utils/store';

  let loading = true;
  let backgroundConnection = false;
  let socket = websocket($url);

  // Check if has locos list in localStorage
  // This is useful to not always show modal when the app is loaded
  // So user can consult the loco list without having to connect first
  // But we try to connect to the server in background
  // If there is no localStorage, it will open the connection modal
  if (localStorage.getItem('locos') && localStorage.getItem('server-address')) {
    backgroundConnection = true;

    const list = JSON.parse(localStorage.getItem('locos'));
    locos.set(list);

    // Set selected loco from localStorage or first loco in list
    if (
      localStorage.getItem('selectedLoco') &&
      localStorage.getItem('indexOfSelectedLoco')
    ) {
      const selected = JSON.parse(localStorage.getItem('selectedLoco'));
      selectedLoco.set(selected);
      indexOfSelectedLoco.set(
        parseInt(localStorage.getItem('indexOfSelectedLoco'), 10),
      );
    } else if (list.length > 0) {
      selectedLoco.set(list[0]);
      indexOfSelectedLoco.set(0);
    } else {
      selectedLoco.set({});
    }
  } else {
    modalToOpen.set('connexionModal');
    locos.set([]);
  }

  const onConnectedInBackground = () => {
    try {
      ws.set(socket);
      socket.send('<s>');

      event.removeListener('connected', onConnectedInBackground);
      event.removeListener('error', onError);
    } catch (error) {
      log.error(error);
    }
  };

  const onConnected = async () => {
    try {
      ws.set(socket);
      socket.send('<s>');

      const data = await getLocos($url);
      locos.set(data);
      selectedLoco.set($locos[0] || {}); // If is undefined set empty object to avoid errors
      powerState.set(false);

      event.removeListener('connected', onConnected);
      event.removeListener('error', onError);

      localStorage.setItem('locos', JSON.stringify($locos));
      localStorage.setItem('server-address', $url);

      // If loco list is empty, open new loco modal
      if ($locos.length === 0) {
        modalToOpen.set('newLoco');
      } else {
        modalToOpen.set('locoSelector');
      }
    } catch (error) {
      log.error(error);
    }
  };

  const onError = (error) => {
    if (!error) {
      ws.set(null);
      loading = false;
    }
  };

  const onTryConnect = () => {
    event.on('connected', onConnected);
    event.on('error', onError);

    socket = websocket($url);
    loading = true;
  };

  event.on(
    'connected',
    backgroundConnection ? onConnectedInBackground : onConnected,
  );
  event.on('error', onError);

  event.on('close', () => {
    loading = false;
    modalToOpen.set('connexionModal');
    ws.set(null);
    socket = null;
  });
</script>

<div
  id="connection-modal"
  class="modal {$modalToOpen === 'connexionModal' ? 'modal-open' : ''}">
  <div class="modal-box text-center">
    <div class="modal-content">
      {#if loading}
        <span
          id="connection-loading"
          class="btn btn-ghost font-semibold text-lg normal-case loading">
          {$_('connectionTo')}
          {$url}
        </span>
      {/if}

      {#if !loading}
        <div id="connection-form">
          <button
            class="btn btn-sm btn-circle btn-ghost drawer-button p-0 absolute right-6"
            on:click|preventDefault="{() => modalToOpen.set('')}">
            <Icon icon="mdi:close" class="w-5 h-5" />
          </button>

          <h2 class="font-semibold text-lg mb-5">{$_('connectionFailed')}</h2>

          <p>{$_('connectionNote')}</p>
          <div class="form-control mt-5">
            <div class="relative">
              <input
                id="address"
                name="address"
                type="text"
                placeholder="192.168.0.155:81"
                class="w-full pr-16 input input-bordered"
                bind:value="{$url}" />
              <button
                class="absolute top-0 right-0 rounded-l-none btn border border-base-100"
                on:click|preventDefault="{onTryConnect}">
                {$_('connect')}
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
