<script lang="js">
  import { slide } from 'svelte/transition';
  import _ from '../../utils/i18n';

  import Icons from '../Icons/Icons.svelte';
  import File from './File.svelte';

  export let expanded = true;
  export let name;
  export let files;
  export let parent = '';

  let folder = name === 'root' ? '/' : parent + '/' + name + '/';

  const toggle = () => {
    expanded = !expanded;
  };
</script>

<span class="cursor-pointer" on:click="{toggle}">
  <Icons
    cssClass="inline-block w-5 mr-2 text-accent"
    icon="{expanded ? 'folder-open' : 'folder-close'}" />
  {#if name === 'root'}
    {$_('root')}
  {:else}
    {name}
  {/if}
</span>

{#if expanded}
  <ul transition:slide>
    {#each files as file}
      <li>
        {#if file.files}
          <svelte:self parent="{folder}" {...file} />
        {:else}
          <File folder="{folder}" {...file} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style lang="postcss">
  ul {
    padding: 0.2em 0 0 0.5em;
    margin: 0 0 0 0.5em;
    list-style: none;
    border-left: 1px solid #eee;
  }
</style>
