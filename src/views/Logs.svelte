<script lang="js">
  import { onMount } from 'svelte';
  import _ from '../utils/i18n';
  import messages, { parseMessage } from '../utils/messages';
  import { addToast, event, modalToOpen, url, ws } from '../utils/store';

  import Connection from '../lib/Connection.svelte';
  import Toast from '../lib/Toast.svelte';

  const filtersType = [
    { key: 'train', label: 'Trains' },
    { key: 'feedback', label: 'S88' },
    { key: 'function', label: 'Fonctions de train' },
    { key: 'accessory', label: 'Accessoires' },
    { key: 'system', label: 'Système' },
  ];

  const filters = {
    train: true,
    feedback: true,
    function: true,
    accessory: true,
    system: true,
  };

  let trainAddress = 1;
  let trainSpeed = 0;
  let trainDirection = 0;
  let accessoryAddress = 1;
  let accessoryDirection = 0;
  let customCmd = '';

  let scrollbox;
  let dccLogs = [];
  let filteredLogs = [];

  const filterLogs = () => {
    filteredLogs = dccLogs.filter((log) => filters[log.category]);
    setTimeout(() => (scrollbox.scrollTop = scrollbox.scrollHeight), 20);
  };

  const onMessageReceived = (data) => {
    const mstType = parseMessage(data);
    dccLogs = [...dccLogs, mstType]; // This and not push to trigger reactivity
    filterLogs();
  };

  const clearLogs = () => {
    dccLogs = [];
    filterLogs();
  };

  const onPowerOn = () => {
    if ($ws) {
      $ws.send(messages.powerOn());
    }
  };

  const onPowerOff = () => {
    if ($ws) {
      $ws.send(messages.powerOff());
    }
  };

  const onSendTrainCommand = () => {
    console.log('test');
    if (trainAddress <= 0) {
      addToast('error', "L'adresse doit être supérieure à 0.");
      return;
    }

    if ($ws && trainAddress !== null && trainSpeed !== null) {
      $ws.send(
        messages.speed(trainAddress, trainAddress, trainSpeed, trainDirection),
      );
    }
  };

  const onSendAccessoryCommand = () => {
    if (accessoryAddress <= 0) {
      addToast('error', "L'adresse doit être supérieure à 0.");
      return;
    }

    if ($ws && accessoryAddress !== null) {
      $ws.send(messages.accessory(accessoryAddress, accessoryDirection));
    }
  };

  const onAccessoryDirectionChange = (event) => {
    accessoryDirection = Number(event.currentTarget.value);
  };

  const onTrainDirectionChange = (event) => {
    trainDirection = Number(event.currentTarget.value);
  };

  const onSendCustomCommand = () => {
    if ($ws && customCmd.trim() !== '') {
      $ws.send(customCmd.trim());
      customCmd = '';
    }
  };

  const onFiltersChange = (event) => {
    const key = event.currentTarget.value;
    filters[key] = event.currentTarget.checked;

    // Apply filters to existing logs
    filterLogs();
  };

  onMount(() => {
    event.on('dccMessage', onMessageReceived);
    return () => {
      event.removeListener('dccMessage', onMessageReceived);
    };
  });

  // Reactive limits
  $: if (trainAddress > 128) trainAddress = 128;
  $: if (trainAddress < 1) trainAddress = 1;
  $: if (trainSpeed > 128) trainSpeed = 128;
  $: if (trainSpeed < 0) trainSpeed = 0;
  $: if (accessoryAddress > 512) accessoryAddress = 512;
  $: if (accessoryAddress < 1) accessoryAddress = 1;
</script>

<div class="flex bg-base-300 min-h-screen py-2 gap-2 overflow-hidden">
  <aside
    class="border-t border-b border-r border-neutral-content/50 rounded-r-xl bg-base-100 w-64">
    <div class="items-center gap-2 px-4 py-2 flex justify-center pt-4">
      <span class="header-lg text-lg font-bold"> Wifi DCC Monitor </span>
    </div>

    <div class="form-control px-4">
      <label for="address" class="label">
        <span class="label-text">{$_('ipAddress')} :</span>
      </label>
      <div class="input-group">
        <input
          id="address"
          name="address"
          type="text"
          placeholder="192.168.0.155:81"
          class="input input-bordered input-sm w-32 {!$ws
            ? 'input-error'
            : 'input-success'}"
          bind:value="{$url}" />
        <button
          class="btn btn-square btn-sm px-2 w-auto {!$ws
            ? 'btn-error'
            : 'btn-success'}"
          on:click="{() => modalToOpen.set('connexionModal')}">
          {!$ws ? `${$_('connect')}` : `${$_('connected')}`}
        </button>
      </div>
    </div>

    <div class="divider">Filtrer les messages</div>
    <div class="mt-4">
      {#each filtersType as filter}
        <label class="label cursor-pointer flex justify-between px-4">
          <span class="label-text">{filter.label}</span>
          <input
            type="checkbox"
            class="toggle toggle-sm toggle-info"
            checked="{filters[filter.key]}"
            value="{filter.key}"
            on:change="{onFiltersChange}" />
        </label>
      {/each}
    </div>
  </aside>

  <div
    class="flex-1 border border-neutral-content/50 rounded-xl bg-base-100 mr-2 overflow-hidden">
    <header class="flex px-4 py-2 gap-4">
      <div class="flex flex-col">
        <h5>Commandes générales</h5>
        <div class="divider m-0"></div>
        <button class="btn btn-sm m-1" on:click="{onPowerOn}">Power on</button>
        <button class="btn btn-sm m-1" on:click="{onPowerOff}"
          >Power off</button>
        <button class="btn btn-sm m-1" on:click="{clearLogs}"
          >Nettoyer les messages</button>
      </div>
      <div class="divider divider-horizontal m-0"></div>
      <div>
        <h5>Commandes de trains</h5>
        <div class="divider m-0"></div>
        <div class="flex gap-4 items-center">
          <div>
            <label for="train-address">Adresse : </label>
            <input
              id="train-address"
              type="number"
              class="input input-bordered input-sm w-20"
              min="1"
              max="128"
              bind:value="{trainAddress}" />
          </div>
          <div>
            <label for="train-speed">Vitesse : </label>
            <input
              id="train-speed"
              type="number"
              class="input input-bordered input-sm w-20"
              min="1"
              max="128"
              bind:value="{trainSpeed}" />
          </div>
        </div>
        <div class="flex flex-row items-center gap-4 mt-2">
          <span>Sens : </span>
          <div class="flex flex-row gap-4">
            <label class="label cursor-pointer">
              <span class="label-text mr-4">Avant</span>
              <input
                type="radio"
                name="train-direction"
                class="radio"
                checked="{trainDirection === 0}"
                value="{0}"
                on:click="{onTrainDirectionChange}" />
            </label>
            <label class="label cursor-pointer">
              <span class="label-text mr-4">Arrière</span>
              <input
                type="radio"
                name="train-direction"
                class="radio"
                checked="{trainDirection === 1}"
                value="{1}"
                on:click="{onTrainDirectionChange}" />
            </label>
          </div>
        </div>
        <button class="btn btn-sm mt-1 w-full" on:click="{onSendTrainCommand}"
          >Envoyer</button>
      </div>
      <div class="divider divider-horizontal m-0"></div>
      <div>
        <h5>Commandes d'accessoires</h5>
        <div class="divider m-0"></div>
        <div class="flex gap-4 items-center">
          <div>
            <label for="accessory-address">Adresse : </label>
            <input
              id="accessory-address"
              type="number"
              class="input input-bordered input-sm w-20"
              min="{1}"
              max="{512}"
              bind:value="{accessoryAddress}" />
          </div>
        </div>
        <div class="flex flex-row items-center gap-4 mt-2">
          <span>Sens : </span>
          <div class="flex flex-row gap-4">
            <label class="label cursor-pointer">
              <span class="label-text mr-4">Droit</span>
              <input
                type="radio"
                name="accessory-direction"
                class="radio"
                checked="{accessoryDirection === 0}"
                value="{0}"
                on:click="{onAccessoryDirectionChange}" />
            </label>
            <label class="label cursor-pointer">
              <span class="label-text mr-4">Dévié</span>
              <input
                type="radio"
                name="accessory-direction"
                class="radio"
                checked="{accessoryDirection === 1}"
                value="{1}"
                on:click="{onAccessoryDirectionChange}" />
            </label>
          </div>
        </div>
        <button
          class="btn btn-sm mt-1 w-full"
          on:click="{onSendAccessoryCommand}">Envoyer</button>
      </div>
    </header>
    <div class="divider m-0"></div>
    <section class="px-4 py-2 flex flex-row gap-2">
      <label for="custom-command" class="min-w-48">
        Commande personalisée :
      </label>
      <input
        id="custom-command"
        type="text"
        class="input input-bordered input-sm w-full"
        bind:value="{customCmd}" />
      <button class="btn btn-sm ml-2" on:click="{onSendCustomCommand}"
        >Envoyer</button>
    </section>
    <section>
      <div class="m-2 overflow-y-auto h-[400px]" bind:this="{scrollbox}">
        <table class="table table-compact text-center w-full table-fixed">
          <thead class="sticky top-0">
            <tr>
              <th class="w-32">Type</th>
              <th class="w-20">Adresse</th>
              <th class="w-80">Instruction</th>
              <th class="w-72">Trame brute</th>
            </tr>
          </thead>
          <tbody class="overflow-visible">
            {#each filteredLogs as log}
              <tr>
                <td>{log.instructionType}</td>
                <td>{log.address || '-'}</td>
                <td>{log.instruction || '-'}</td>
                <td>
                  <span
                    class="w-72 block overflow-hidden text-ellipsis"
                    title="{log.raw}">
                    {log.raw}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  </div>
  <Connection />
  <Toast />
</div>
