<script lang="js">
  import {
    locos,
    selectedLoco,
    indexOfSelectedLoco,
    hasDataToSave,
  } from '../../utils/store';

  import _ from '../../utils/i18n';
  import { listOfLocoFunctions } from '../../utils/utils';

  import Upload from '../Upload.svelte';

  let imgUrl = null;
  let child = null;

  selectedLoco.subscribe(() => {
    imgUrl = $selectedLoco.imageUrl ? $selectedLoco.imageUrl : null;

    if (child) {
      child.setImage(imgUrl);
    }
  });

  const onSave = () => {
    locos.update((value) => {
      const list = value;
      list[indexOfSelectedLoco] = selectedLoco;
      return list;
    });
    hasDataToSave.set(true);
  };
</script>

<div
  class="collapse border rounded-box border-base-300 collapse-arrow bg-opacity-0
  {!$selectedLoco.address && 'collapse-close'}">
  <input type="checkbox" checked />

  <div class="collapse-title text-xl font-medium">
    {#if $selectedLoco && $selectedLoco.shortName}
      {$_('locoParams')} : {$selectedLoco.shortName}
    {:else if $selectedLoco && $selectedLoco.longName}
      {$_('loco')} : {$selectedLoco.longName}
    {:else}
      {$_('locoNotSelected')}
    {/if}
  </div>

  <div class="collapse-content flex flex-row space-x-7">
    <div class="flex-auto max-w-xs">
      <span class="text-lg underline underline-offset-4">
        {$_('generalInfos')}
      </span>

      <div class="form-control">
        <label for="address" class="label">
          <span class="label-text">{$_('address')}:</span>
        </label>
        <input
          id="address"
          name="address"
          type="number"
          class="input input-bordered input-sm max-w-xs"
          bind:value="{$selectedLoco.address}"
          on:input="{onSave}" />
      </div>

      <div class="form-control">
        <label for="short-name" class="label">
          <span class="label-text">{$_('shortName')}:</span>
        </label>
        <input
          id="short-name"
          name="short-name"
          type="text"
          placeholder=""
          class="input input-bordered input-sm max-w-xs"
          bind:value="{$selectedLoco.shortName}"
          on:input="{onSave}" />
      </div>

      <div class="form-control">
        <label for="long-name" class="label">
          <span class="label-text">{$_('longName')}:</span>
        </label>
        <input
          id="long-name"
          name="long-name"
          type="text"
          class="input input-bordered input-sm max-w-xs"
          bind:value="{$selectedLoco.longName}"
          on:input="{onSave}" />
      </div>

      <div class="form-control grow-0 w-80">
        <span class="label label-text">{$_('image')}:</span>
        <Upload bind:this="{child}" bind:imgUrl hasSaveBtn="{true}" />
      </div>
    </div>

    <div class="divider divider-vertical"></div>

    <div class="flex-auto">
      <span class="text-lg underline underline-offset-4">
        {$_('functionsDescription')}
      </span>

      <div
        class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {#each listOfLocoFunctions as func}
          <div class="form-control">
            <label for="{func}" class="label">
              <span class="label-text">F{func}:</span>
            </label>
            <input
              id="param-{func}"
              name="param-{func}"
              type="text"
              class="input input-bordered input-sm max-w-xs"
              bind:value="{$selectedLoco[`${func}`]}"
              on:input="{onSave}" />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
