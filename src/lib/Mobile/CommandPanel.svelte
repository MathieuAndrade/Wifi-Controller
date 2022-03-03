<script lang="js">
  import { ws, locos, powerState } from '../../utils/store';

  import messages from '../../utils/messages';

  import LocoFunctions from '../../lib/LocoFunctions.svelte';
  import Gauge from '../../lib/Gauge.svelte';

  let dir = 0;
  let speed = 0;
  let indexOfSelectedLoco = -1;
  let address = -1;

  const onSpeedChange = () => {
    if ($powerState && address && address !== 0 && address !== -1) {
      $ws.send(messages.speed(indexOfSelectedLoco + 1, address, speed, dir));
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
</script>

<div class="flex flex-col space-y-5 w-4/5 sm:w-6/12 md:w-4/12">
  <div class="flex flex-row space-x-2">
    <select
      class="select select-bordered select-sm w-[75%]"
      bind:value="{indexOfSelectedLoco}"
      on:change="{() => (address = $locos[indexOfSelectedLoco].address)}"
    >
      <option disabled="disabled" selected="selected" value="{-1}">
        Loco
      </option>
      {#each $locos as loco, index}
        <option value="{index}"> {loco.shortName} </option>
      {/each}
    </select>

    <input
      name="addr"
      type="number"
      placeholder="Adresse"
      class="input input-sm input-bordered max-w-[20%]"
      bind:value="{address}"
      on:change="{() => (speed = 0)}"
    />
  </div>
  <div class="flex place-content-center">
    <Gauge mode="dmc" bind:speed onSpeedChange="{onSpeedChange}" />
  </div>
  <div class="flex flex-row space-x-2 justify-between">
    <button
      class="btn btn-outline btn-sm rounded-btn {dir === 1 ? '' : 'btn-accent'}"
      on:click|preventDefault="{onChangeDirection}"
    >
      <svg
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
        class="inline-block w-5 lg:mr-2"
      >
        <path
          d="M2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2S2 6.48 2 12zm18 0c0 4.42-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8zM8 12l4-4l1.41 1.41L11.83 11H16v2h-4.17l1.59 1.59L12 16l-4-4z"
          fill="currentColor"
        >
        </path>
      </svg>
      <span class="hidden lg:block">Avant</span>
    </button>

    <button
      class="btn btn-outline btn-sm btn-warning rounded-btn hidden xs:block"
      on:click|preventDefault="{onStop}"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        class="inline-block w-5 mr-2"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z"
          fill="currentColor"
        >
        </path>
      </svg>
      <span> Stop </span>
    </button>

    <button
      class="btn btn-outline btn-sm rounded-btn
      {dir === 0 ? '' : 'btn-accent'}"
      on:click|preventDefault="{onChangeDirection}"
    >
      <span class="hidden lg:block">Arrière</span>
      <svg
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
        class="inline-block w-5 lg:ml-2"
      >
        <path
          d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10s10-4.48 10-10zM4 12c0-4.42 3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8s-8-3.58-8-8zm12 0l-4 4l-1.41-1.41L12.17 13H8v-2h4.17l-1.59-1.59L12 8l4 4z"
          fill="currentColor"
        >
        </path>
      </svg>
    </button>
  </div>
  <div>
    <input
      type="range"
      class="track-cursor w-full"
      min="0"
      max="160"
      bind:value="{speed}"
      on:change="{onSpeedChange}"
    />
  </div>
  <div class="rounded-box border border-base-300 p-5">
    <div class="max-h-72 overflow-auto">
      <LocoFunctions />
    </div>
  </div>
</div>
