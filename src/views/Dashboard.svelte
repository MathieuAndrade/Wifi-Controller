<script lang="js">
  import Router from 'svelte-spa-router';

  import Connection from '../lib/Connection.svelte';
  import Drawer from '../lib/Dashboard/Drawer.svelte';
  import DeleteLoco from '../lib/Dashboard/loco/DeleteLoco.svelte';
  import Navbar from '../lib/Dashboard/Navbar.svelte';
  import NewLoco from '../lib/Dashboard/NewLoco.svelte';
  import EspStats from '../lib/EspStats/Modal.svelte';
  import LocoSelectorModal from '../lib/LocoSelectorModal.svelte';

  import Accessoires from '../lib/Dashboard/accessories/Accessories.svelte';
  import Feedback from '../lib/Dashboard/feedback/Feedback.svelte';
  import Loco from '../lib/Dashboard/loco/Loco.svelte';
  import Toast from '../lib/Toast.svelte';

  import {
    addToast,
    cvId,
    event,
    hasDataToSave,
    indexOfSelectedLoco,
    locos,
    selectedLoco,
  } from '../utils/store';

  import { sortByKey } from '../utils/utils';

  const routes = {
    '/dashboard/locomotive': Loco,
    '/dashboard/locomotive/*': Loco,
    '/dashboard/feedback': Feedback,
    '/dashboard/accessories': Accessoires,
  };

  let loco = {};

  const onSave = () => {
    locos.update((value) => {
      const list = value;
      list[indexOfSelectedLoco] = loco;
      return list;
    });

    selectedLoco.set(loco);
    hasDataToSave.set(true);
  };

  selectedLoco.subscribe((value) => {
    loco = value ? value : {}; // On first run value can be undefined

    if (!loco.cvs) {
      loco.cvs = []; // Force initialization for first run
    }
  });

  event.on('dccMessage', (data) => {
    if (data.includes(`<r${cvId}|${cvId}|`)) {
      // <rID|ID|cv value>
      const cv = parseInt(data.split('|')[2].split(' ')[0]);
      let value = parseInt(data.split(' ')[1].replace('>', ''));

      if (value === -1) {
        addToast(
          'error',
          'Une erreur est survenue lors de la lecture de la valeur du CV',
        );
        event.emit('cvError', cv);
        return;
      }

      // If cv already exist, update his value
      if (loco.cvs.some((c) => c.id === cv)) {
        let index = loco.cvs.findIndex((c) => c.id === cv);
        loco.cvs[index].value = value;
      } else {
        loco.cvs.push({
          id: cv,
          defaultValue: '',
          value: value,
        });

        // Sort list if necessary
        loco.cvs = sortByKey(loco.cvs, 'id');
      }

      // Finally save to list and display toast
      onSave();
      addToast('success', `Valeur du CV ${cv}: ${value}`);
      event.emit('newCvValue', cv);
    }
  });
</script>

<div>
  <Drawer>
    <Navbar />
    <main class="p-6">
      <Router routes="{routes}" />
    </main>
  </Drawer>

  <Connection />
  <LocoSelectorModal />
  <NewLoco />
  <DeleteLoco />
  <EspStats />
  <Toast />
</div>
