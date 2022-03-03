<script lang="js">
  import {
    url,
    locos,
    selectedLoco,
    indexOfSelectedLoco,
    indexOfLocoToDelete,
  } from '../../utils/store';

  import { listOfLocoKeys } from '../../utils/utils';
  import { uploadFile, deleteFile } from '../../utils/api';

  indexOfLocoToDelete.subscribe((value) => {
    if (value !== -1) {
      document.getElementById('delete-loco').classList.add('modal-open');
    }
  });

  const onDelete = async () => {
    // First delete image if exist
    if ($locos[$indexOfLocoToDelete].imageUrl) {
      await deleteFile(
        $url,
        $locos[$indexOfLocoToDelete].imageUrl.substring(1),
      );
      localStorage.removeItem($locos[$indexOfLocoToDelete].imageUrl);
    }

    // Then filter list to remove deleted loco
    let list = $locos;
    list = list.filter(
      (loco) => loco.address !== $locos[$indexOfLocoToDelete].address,
    );

    // Save new loco list
    const data = new File(
      [JSON.stringify(list, listOfLocoKeys)],
      'locos.json',
      { type: 'application/json' },
    );
    await uploadFile($url, data, 'locos.json');

    // Check if deleted loco is selected loco or if all locos are deleted
    if ($indexOfLocoToDelete === $indexOfSelectedLoco || $locos.length === 0) {
      indexOfSelectedLoco.set($locos[0] ? 0 : -1);
      selectedLoco.set($locos[$indexOfSelectedLoco] || {}); // If is undefined set empty object to avoid errors
    }

    // Finaly reset state and close modal
    locos.set(list);
    indexOfLocoToDelete.set(-1);
    document.getElementById('delete-loco').classList.remove('modal-open');
  };

  const onCancel = () => {
    document.getElementById('delete-loco').classList.remove('modal-open');
  };
</script>

<div id="delete-loco" class="modal">
  <div class="modal-box text-center">
    <div class="modal-content">
      <h2 class="font-semibold text-xl mb-5">
        Êtes-vous sûr de vouloir supprimer la loco
        <span class="font-bold text-accent">
          {#if $locos[$indexOfLocoToDelete]}
            {$locos[$indexOfLocoToDelete].shortName}
          {/if}
        </span>
        ?
      </h2>
    </div>
    <div class="modal-action">
      <button
        class="btn btn-accent btn-sm"
        type="reset"
        on:click|preventDefault="{onDelete}"
      >
        Confirmer
      </button>
      <button
        class="btn btn-sm"
        type="reset"
        on:click|preventDefault="{onCancel}"
      >
        Annuler
      </button>
    </div>
  </div>
</div>
