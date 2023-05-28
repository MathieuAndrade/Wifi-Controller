<script lang="js">
  import { modalToOpen } from '../utils/store';

  import _ from '../utils/i18n';

  import LocoList from './LocoList.svelte';
</script>

<div
  class="modal {$modalToOpen === 'locoSelector'
    ? 'modal-open'
    : ''}">
  <div class="modal-box text-center">
    <h2 class="font-semibold text-lg mb-5">{$_('chooseLoco')}</h2>
    <LocoList id={"selector_modal"} hasHeader={false}/>
  </div>
</div>
