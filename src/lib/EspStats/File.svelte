<script lang="js">
  import { url } from '../../utils/store';
  import { humanFileSize } from '../../utils/utils';

  import FileIcon from './FileIcon.svelte';

  export let folder;
  export let name;
  export let size;

  let type = name.slice(name.lastIndexOf('.') + 1);
</script>

<a href="{`http://${$url}${folder}${name}`}" target="_blank">
  <FileIcon type="{type}" />
  {name}
</a>
<span class="size"> - {humanFileSize(size)}</span>

<style lang="postcss">
  .size {
    font-size: 13px;
    font-style: italic;
    letter-spacing: 0.4px;
    color: #a8a8a8;
  }
</style>
