<script lang="js">
  import Arrow from './Arrow.svelte';
  import Close from './Close.svelte';
  import Download from './Download.svelte';
  import File from './File.svelte';
  import Folder from './Folder.svelte';
  import Help from './Help.svelte';
  import Logs from './Logs.svelte';
  import Menu from './Menu.svelte';
  import Play from './Play.svelte';
  import Power from './Power.svelte';
  import Save from './Save.svelte';
  import Stats from './Stats.svelte';
  import Stop from './Stop.svelte';
  import Trash from './Trash.svelte';
  import Warning from './Warning.svelte';

  export let cssClass = '';
  export let icon = '';
</script>

{#if icon === 'arrow-up' || icon === 'arrow-down' || icon === 'arrow-left' || icon === 'arrow-right'}
  <Arrow cssClass="{cssClass}" icon="{icon}" />
{:else if icon === 'close'}
  <Close cssClass="{cssClass}" />
{:else if icon === 'download'}
  <Download cssClass="{cssClass}" />
{:else if icon === 'gif' || icon === 'png' || icon === 'jpg' || icon === 'jpeg' || icon === 'svg' || icon === 'json' || icon === 'gz' || icon === 'html' || icon === 'html.gz'}
  <File cssClass="{cssClass}" icon="{icon}" />
{:else if icon === 'folder-open' || icon === 'folder-close'}
  <Folder cssClass="{cssClass}" icon="{icon}" />
{:else if icon === 'help'}
  <Help cssClass="{cssClass}" />
{:else if icon === 'logs'}
  <Logs cssClass="{cssClass}" />
{:else if icon === 'menu'}
  <Menu cssClass="{cssClass}" />
{:else if icon === 'play'}
  <Play cssClass="{cssClass}" />
{:else if icon === 'power'}
  <Power cssClass="{cssClass}" />
{:else if icon === 'save'}
  <Save cssClass="{cssClass}" />
{:else if icon === 'stats'}
  <Stats cssClass="{cssClass}" />
{:else if icon === 'stop'}
  <Stop cssClass="{cssClass}" />
{:else if icon === 'trash'}
  <Trash cssClass="{cssClass}" />
{:else if icon === 'warning'}
  <Warning cssClass="{cssClass}" />
{:else}
  <File cssClass="{cssClass}" icon="file" />
{/if}
