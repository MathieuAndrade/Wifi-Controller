<script lang="js">
  import Navbar from '../lib/Navbar.svelte';
  import Drawer from '../lib/Mobile/Drawer.svelte';
  import CommandPanel from '../lib/Mobile/CommandPanel.svelte';
  import Connection from '../lib/Connection.svelte';

  //TODO: Afficher la boite de connexion
</script>

<div class="relative flex h-screen">
  <Drawer>
    <Navbar mode="dmc" />
    <main
      class="h-full overflow-auto flex flex-wrap justify-center p-3 pb-20 space-y-10 sm:space-y-0 sm:space-x-10"
    >
      <CommandPanel />
      <CommandPanel />
    </main>
  </Drawer>
  <Connection />
</div>
