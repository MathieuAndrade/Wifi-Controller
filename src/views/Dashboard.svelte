<script lang="js">
  import Router from 'svelte-spa-router';

  import Drawer from '../lib/Dashboard/Drawer.svelte';
  import Navbar from '../lib/Dashboard/Navbar.svelte';
  import Connection from '../lib/Connection.svelte';
  import EspStats from '../lib/EspStats/Modal.svelte';
  import DeleteLoco from '../lib/Dashboard/loco/DeleteLoco.svelte';
  import NewLoco from '../lib/Dashboard/NewLoco.svelte';

  import Loco from '../lib/Dashboard/loco/Loco.svelte';
  import Feedback from '../lib/Dashboard/feedback/Feedback.svelte';
  import Accessoires from '../lib/Dashboard/accessories/Accessories.svelte';
  import Toast from '../lib/Toast.svelte';

  const routes = {
    '/dashboard/locomotive': Loco,
    '/dashboard/locomotive/*': Loco,
    '/dashboard/feedback': Feedback,
    '/dashboard/accessories': Accessoires,
  };
</script>

<div>
  <Drawer>
    <Navbar />
    <main class="p-6">
      <Router routes="{routes}" />
    </main>
  </Drawer>

  <Connection />
  <NewLoco />
  <DeleteLoco />
  <EspStats />
  <Toast />
</div>
