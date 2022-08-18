<script lang="js">
  import Icon from '@iconify/svelte';
  import {
    url,
    locos,
    indexOfSelectedLoco,
    selectedLoco,
  } from '../utils/store';


  import _ from '../utils/i18n';
  import { getDataUrl, listOfLocoKeys } from '../utils/utils';
  import { getImageFromUrl, uploadFile, deleteFile } from '../utils/api';
  import log from '../utils/log';

  export let imgUrl = null;
  export let hasSaveBtn = false;

  let img = null;
  let imgName = null;
  let imgData = null;
  let imgExtension = null;
  let imgToLarge = false;

  export async function upload() {
    try {
      if (imgUrl.startsWith('/images')) {
        await uploadFile($url, img, imgUrl);
        localStorage.setItem(imgUrl, imgData);
      }

      // Reset all states
      imgName = null;
      imgData = null;
      imgExtension = null;
      imgToLarge = false;

      return true;
    } catch (error) {
      log.error(error);
    }
  }

  export async function setImage(url) {
    imgUrl = url;

    if (imgUrl && imgUrl.startsWith('/images')) {
      const store = localStorage.getItem(imgUrl);

      if (store) {
        imgData = store;
      } else {
        const img = await getImageFromUrl($url, imgUrl);
        imgData = await getDataUrl(img);
        localStorage.setItem(imgUrl, imgData);
      }

      imgName =
        imgUrl.substring(0, imgUrl.lastIndexOf('.')).replace('/images/', '') ||
        imgUrl;
      imgExtension = imgUrl.replace(imgName, '');
    }
  }

  const onSave = async () => {
    try {
      if (imgUrl.startsWith('/images')) {
        await deleteFile(
          $url,
          $locos[$indexOfSelectedLoco].imageUrl.substring(1),
        );
        localStorage.removeItem($locos[$indexOfSelectedLoco].imageUrl);

        await uploadFile($url, img, imgUrl);
        localStorage.setItem(imgUrl, imgData);
      }

      $selectedLoco.imageUrl = imgUrl;
      locos.update((value) => {
        const list = value;
        list[$indexOfSelectedLoco] = $selectedLoco;
        return list;
      });

      // Save new loco list
      const data = new File(
        [JSON.stringify($locos, listOfLocoKeys)],
        'locos.json',
        { type: 'application/json' },
      );
      await uploadFile($url, data, 'locos.json');
    } catch (error) {
      log.error(error);
    }
  };

  const onUpload = async (event) => {
    let file = event.target.files[0];
    imgToLarge = false;

    if (file.size < 100000) {
      img = file;
      imgData = await getDataUrl(file);
      imgName = file.name;

      // Remove file extension and save it, user cannot modify it
      imgName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      imgExtension = file.name.replace(imgName, '');
      imgUrl = `/images/${imgName}${imgExtension}`;
    } else {
      imgToLarge = true;
    }
  };
</script>

<div class="flex flex-col p-3 border rounded-lg border-gray-500/80">
  {#if imgUrl}
    <div class="flex flex-col relative">
      <img
        class="place-self-center"
        src="{imgUrl && imgUrl.startsWith('/images') ? imgData : imgUrl}"
        alt=""
      />
      <button
        class="place-self-center absolute h-full w-full bg-base-100 opacity-0 hover:opacity-70"
        on:click|preventDefault="{() => (imgUrl = null)}"
      >
        <Icon icon="mdi:trash-outline" class="inline-block w-7 h-7"/>
      </button>
    </div>
    {#if imgName}
      <div class="form-control">
        <label for="name" class="label">
          <span class="label-text"> {$_('imageName')}: </span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder=""
          class="input input-bordered input-sm max-w-xs"
          bind:value="{imgName}"
          on:change="{() => (imgUrl = `/images/${imgName}${imgExtension}`)}"
        />
      </div>
    {/if}

    {#if hasSaveBtn}
      <button
        class="btn btn-outline btn-sm mt-4"
        disabled="{$selectedLoco.imageUrl === imgUrl}"
        on:click|preventDefault="{onSave}"
      >
        <Icon icon="ic:round-save-as" class="w-5 h-5 mr-2"/>
        {$_('saveImage')}
      </button>
    {/if}
  {:else}
    <div
      class="flex relative h-12 border border-dashed border-gray-500/80 hover:border-accent rounded items-center justify-center"
    >
      <span class="cursor-pointer">{$_('choseFile')}</span>
      <input
        class="absolute h-full w-full opacity-0 cursor-pointer"
        type="file"
        name="files"
        accept=".png, .jpg, .jpeg, .svg, .gif"
        on:change="{onUpload}"
      />
    </div>
    <span class="text-xs">
      {$_('imageNote')}
    </span>
    {#if imgToLarge}
      <span class="text-sm text-error">
        {$_('toHeavyImage')}
      </span>
    {/if}
    <div class="divider mb-3">{$_('or')}</div>
    <div class="form-control">
      <label for="url" class="label">
        <span class="label-text"> {$_('url')}: </span>
        <span
          class="label-text-alt tooltip"
          data-tip={$_('urlNoteDescription')}
        >
        {$_('urlNoteTitle')}
        </span>
      </label>
      <input
        id="url"
        name="url"
        type="url"
        placeholder="http://..."
        class="input input-bordered input-sm max-w-xs"
        bind:value="{imgUrl}"
      />
    </div>
  {/if}
</div>

<style lang="postcss">
  ::-webkit-file-upload-button {
    display: none;
  }
</style>
