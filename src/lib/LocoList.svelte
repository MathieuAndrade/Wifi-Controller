<script lang="js">
  import Icon from '@iconify/svelte';

  import {
    locos,
    selectedLoco,
    indexOfSelectedLoco,
    indexOfLocoToDelete,
    modalToOpen,
  } from '../utils/store';

  import _ from '../utils/i18n';
  import { isValidImage } from '../utils/utils';

  import Image from './Image.svelte';

  export let id = 'loco_list';
  export let hasHeader = true;

  const onChange = (event) => {
    indexOfSelectedLoco.set(Number(event.currentTarget.value));
    selectedLoco.set($locos[event.currentTarget.value]);
    modalToOpen.set('');
  };

  const onDelete = (index) => {
    indexOfLocoToDelete.set(index);
  };
</script>

<ul id={id} class="menu menu-compact flex flex-col p-0 px-4">
  {#if hasHeader}
    <li></li>

    <li class="menu-title">
      <span>{$_('locos')}</span>
    </li>
  {/if}
  {#each $locos as loco, index (index)}
    <li>
      <label class="cursor-pointer label flex w-full">
        <Image
          imgUrl="{isValidImage(loco.imageUrl) ? loco.imageUrl : '/images/train.png'}"
          alt="{loco.shortName}"
          width="{70}" />
        <span
          class="label-text basis-20 text-center text-ellipsis overflow-hidden shrink whitespace-nowrap"
          >{loco.shortName}</span>
        <input
          type="radio"
          name={id+index}
          id={id+index}
          checked="{$indexOfSelectedLoco === index}"
          class="radio"
          on:change="{onChange}"
          value="{index}" />
        <button
          class="z-20 btn btn-sm btn-outline btn-square no-padding"
          title="{$_('deleteLoco')}"
          on:click|preventDefault="{() => onDelete(index)}">
          <Icon icon="mdi:trash-outline" class="w-4 h-4" />
        </button>
      </label>
    </li>
  {/each}
</ul>
