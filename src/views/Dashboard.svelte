<script lang="js">
  import Drawer from '../lib/Drawer.svelte';
  import Navbar from '../lib/Navbar.svelte';
  import Connection from '../lib/Connection.svelte';
  import EspStats from '../lib/EspStats/Modal.svelte';

  import LocoCommand from '../lib/Dashboard/LocoCommand.svelte';
  import LocoParams from '../lib/Dashboard/LocoParams.svelte';
  import LocoCv from '../lib/Dashboard/LocoCV.svelte';
  import NewLoco from '../lib/Dashboard/NewLoco.svelte';
  import DeleteLoco from '../lib/Dashboard/DeleteLoco.svelte';
</script>

<div class="relative flex h-screen">
  <Drawer>
    <Navbar />
    <main class="h-full overflow-auto p-5 space-y-5 pb-20">
      <LocoCommand />
      <LocoParams />
      <LocoCv />
    </main>
  </Drawer>

  <Connection />
  <NewLoco />
  <DeleteLoco />
  <EspStats />
</div>
