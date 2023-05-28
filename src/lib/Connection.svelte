<script lang="js">
  import {
    event,
    url,
    ws,
    locos,
    selectedLoco,
    modalToOpen,
    powerState,
    indexOfSelectedLoco,
  } from '../utils/store';

  import _ from '../utils/i18n';
  import { getLocos } from '../utils/api';
  import websocket from '../utils/websocket';
  import log from '../utils/log';

  let loading = false;
  let socket = websocket($url);

  const onConnected = async () => {
    try {
      ws.set(socket);
      socket.send('<s>');

      const data = await getLocos($url);
      locos.set(data);
      selectedLoco.set($locos[0] || {}); // If is undefined set empty object to avoid errors
      powerState.set(false);

      document
        .getElementById('connection-modal')
        .classList.remove('modal-open');

      event.removeListener('connected', onConnected);
      event.removeListener('error', onError);

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

  event.on('connected', onConnected);
  event.on('error', onError);

  event.on('close', () => {
    loading = true;
    document.getElementById('connection-modal').classList.add('modal-open');
    ws.set(null);
    socket = null;
  });

  const onConnect = () => {
    event.on('connected', onConnected);
    event.on('error', onError);

    socket = websocket($url);
    loading = false;
  };
</script>

<div id="connection-modal" class="modal modal-open">
  <div class="modal-box text-center">
    <div class="modal-content flex flex-col items-center">
      {#if !loading}
        <span
          id="connection-loading"
          class="btn btn-ghost font-semibold text-lg normal-case loading">
          {$_('connectionTo')}
          {$url}
        </span>
      {/if}

      {#if loading}
        <div id="connection-form">
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
                on:click|preventDefault="{onConnect}">
                {$_('connect')}
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
