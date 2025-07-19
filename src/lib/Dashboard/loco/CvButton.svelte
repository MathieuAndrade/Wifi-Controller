<script lang="js">
  import Icon from '@iconify/svelte';
  import _ from '../../../utils/i18n';

  export let cssClass = '';
  export let hideText = true;
  export let onReadClick;
  export let onWriteClick;
</script>

<div class="flex flex-row {cssClass}">
  <button
    class="btn btn-outline btn-xs btn-success mr-2"
    on:click|preventDefault="{onReadClick}">
    <Icon
      icon="eva:arrow-circle-down-outline"
      class="inline-block w-5 h-5 {hideText ? 'mr-0 xl:mr-2' : 'mr-2'}" />
    <span class="{hideText ? 'hidden xl:block' : ''}">{$_('read')}</span>
  </button>
  <button
    class="btn btn-outline btn-xs btn-warning"
    on:click|preventDefault="{onWriteClick}">
    <Icon
      icon="eva:arrow-circle-up-outline"
      class="inline-block w-5 h-6 {hideText ? 'mr-0 xl:mr-2' : 'mr-2'}" />
    <span class="{hideText ? 'hidden xl:block' : ''}">{$_('write')}</span>
  </button>
</div>
