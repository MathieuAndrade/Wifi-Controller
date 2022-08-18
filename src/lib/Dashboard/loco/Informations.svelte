<script lang="js">
  import { afterUpdate } from 'svelte';
  import {
    locos,
    selectedLoco,
    indexOfSelectedLoco,
    hasDataToSave,
  } from '../../../utils/store';

  import _ from '../../../utils/i18n';
  import { listOfLocoFunctions } from '../../../utils/utils';

  import Upload from '../../../lib/Upload.svelte';

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

  afterUpdate(() => {
    if (child) {
      child.setImage(imgUrl);
    }
  });
</script>

<div class="flex flex-col space-y-5">
  <div class="flex flex-row flex-wrap space-y-7 sm:space-y-0 justify-between">
    <div class="flex-auto mr-7 max-w-xs">
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
    </div>

    <div class="flex-auto mr-7 max-w-xs">
      <span class="text-lg underline underline-offset-4">
        {$_('furtherInfos')}
      </span>

      <div class="form-control">
        <label for="decoder" class="label">
          <span class="label-text">{$_('locoMark')}:</span>
        </label>
        <input
          id="decoder"
          name="decoder"
          type="text"
          class="input input-bordered input-sm max-w-xs"
          bind:value="{$selectedLoco.mark}"
          on:input="{onSave}" />
      </div>

      <div class="form-control">
        <label for="decoder" class="label">
          <span class="label-text">{$_('locoDecoder')}:</span>
        </label>
        <input
          id="decoder"
          name="decoder"
          type="text"
          class="input input-bordered input-sm max-w-xs"
          bind:value="{$selectedLoco.decoder}"
          on:input="{onSave}" />
      </div>

      <div class="form-control">
        <label for="length" class="label">
          <span class="label-text">{$_('length')}:</span>
        </label>
        <input
          id="length"
          name="length"
          type="text"
          placeholder=""
          class="input input-bordered input-sm max-w-xs"
          bind:value="{$selectedLoco.length}"
          on:input="{onSave}" />
      </div>
    </div>

    <div class="flex-auto mr-7 max-w-xs">
      <span class="text-lg underline underline-offset-4">
        {$_('description')}
      </span>

      <div class="form-control mt-3">
        <textarea
          class="textarea textarea-bordered"
          bind:value="{$selectedLoco.description}"
          on:input="{onSave}"/>
      </div>
    </div>

    <div class="form-control grow-0 w-96">
      <span class="text-lg underline underline-offset-4 mb-3">
        {$_('image')}
      </span>
      <Upload bind:this="{child}" bind:imgUrl hasSaveBtn="{true}" />
    </div>
  </div>

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
