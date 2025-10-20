<script lang="js">
  import {
    indexOfSelectedLoco,
    locos,
    modalToOpen,
    selectedLoco,
    url,
  } from '../../utils/store';

  import { uploadFile } from '../../utils/api';
  import _ from '../../utils/i18n';
  import log from '../../utils/log';
  import { listOfLocoKeys } from '../../utils/utils';

  import Upload from '../Upload.svelte';

  let addrEmpty = false;
  let fieldsEmpty = false;
  let newLoco = {};
  let imgUrl = null;
  let loading = false;
  let child = null;

  const onCreate = async () => {
    loading = true;

    // Check fields first
    if (!newLoco.address) {
      addrEmpty = true;
      loading = false;
      return;
    }

    if (!newLoco.shortName && !newLoco.longName) {
      fieldsEmpty = true;
      loading = false;
      return;
    }

    try {
      // First upload img if necessary
      if (imgUrl) {
        await child.upload();
        newLoco.imageUrl = imgUrl;
      }

      // Then update store
      locos.update((value) => (value = [...value, newLoco]));
      selectedLoco.set(newLoco);
      indexOfSelectedLoco.set($locos.length - 1);

      // Save new loco list
      const data = new File(
        [JSON.stringify($locos, listOfLocoKeys)],
        'locos.json',
        { type: 'application/json' },
      );
      await uploadFile($url, data, 'locos.json');
      await uploadFile(null, data, 'locos.json');

      // Reset all states
      addrEmpty = false;
      fieldsEmpty = false;
      imgUrl = null;
      newLoco = {};

      // Close modal
      modalToOpen.set('');
    } catch (error) {
      log.error(error);
    }
    loading = false;
  };

  const onCancel = () => {
    addrEmpty = false;
    fieldsEmpty = false;
    newLoco = {};
    imgUrl = null;
    loading = false;
    modalToOpen.set('');
  };
</script>

<div class="modal {$modalToOpen === 'newLoco' ? 'modal-open' : ''}">
  {#if loading}
    <div class="modal-box text-center">
      <span id="connection-loading" class="btn btn-ghost btn-lg loading"></span>
    </div>
  {:else}
    <form class="modal-box text-center">
      <div class="modal-content flex flex-col items-center">
        <h2 class="font-semibold text-2xl mb-5">{$_('newLoco')}</h2>
        <div class="form-control w-2/3">
          <label for="address" class="label">
            <span class="label-text">{$_('address')}:</span>
          </label>
          <input
            id="address"
            name="address"
            type="number"
            placeholder=""
            autocomplete="off"
            class="input input-bordered input-sm max-w-xs
          {addrEmpty && 'input-error'}"
            bind:value="{newLoco.address}" />
          {#if addrEmpty}
            <label for="address" class="label">
              <span class="label-text-alt">
                {$_('emptyAddress')}
              </span>
            </label>
          {/if}
        </div>

        <div class="form-control w-2/3">
          <label for="short-name" class="label">
            <span class="label-text">{$_('shortName')}:</span>
          </label>
          <input
            id="short-name"
            name="short-name"
            type="text"
            placeholder=""
            class="input input-bordered input-sm max-w-xs
          {fieldsEmpty && 'input-error'}"
            bind:value="{newLoco.shortName}" />
          {#if fieldsEmpty}
            <label for="address" class="label">
              <span class="label-text-alt">
                {$_('emptyField')}
              </span>
            </label>
          {/if}
        </div>

        <div class="form-control w-2/3">
          <label for="long-name" class="label">
            <span class="label-text">{$_('longName')}:</span>
          </label>
          <input
            id="long-name"
            name="long-name"
            type="text"
            placeholder=""
            class="input input-bordered input-sm max-w-xs
          {fieldsEmpty && 'input-error'}"
            bind:value="{newLoco.longName}" />
          {#if fieldsEmpty}
            <label for="address" class="label">
              <span class="label-text-alt">
                {$_('emptyField')}
              </span>
            </label>
          {/if}
        </div>

        <div class="form-control w-2/3">
          <span class="label label-text">{$_('image')}:</span>
          <Upload bind:this="{child}" bind:imgUrl="{imgUrl}" />
        </div>
      </div>
      <div class="modal-action">
        <button
          class="btn btn-accent btn-sm"
          type="reset"
          on:click|preventDefault="{onCreate}">{$_('ended')}</button>
        <button
          class="btn btn-sm"
          type="reset"
          on:click|preventDefault="{onCancel}">
          {$_('cancel')}
        </button>
      </div>
    </form>
  {/if}
</div>
