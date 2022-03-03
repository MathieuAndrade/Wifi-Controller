<script lang="js">
  import { url, selectedLoco } from '../utils/store';
  import { afterUpdate } from 'svelte';
  import { getImageFromUrl } from '../utils/api';
  import { getDataUrl } from '../utils/utils';

  export let imgUrl = null;
  export let cssClass = 'border p-2 border-base-300 rounded-xl shadow-lg';
  export let width = null;

  let img = null;

  afterUpdate(async () => {
    if (imgUrl && imgUrl.startsWith('/images')) {
      const store = localStorage.getItem(imgUrl);

      if (store) {
        img = store;
      } else {
        const data = await getImageFromUrl($url, imgUrl);
        img = await getDataUrl(data);
        localStorage.setItem(imgUrl, img);
      }
    }
  });
</script>

<img
  alt="{$selectedLoco.shortName}"
  src="{img}"
  class="{cssClass}"
  width="{width}"
/>
