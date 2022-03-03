<div class="flex-grow drawer h-full">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="h-full drawer-content">
    <slot />
  </div>
  <div class="drawer-side">
    <label for="drawer" class="drawer-overlay"></label>
    <ul class="overflow-y-auto pt-14 menu w-80 bg-base-100 text-base-content">
      <li>Profile</li>
      <li>Messages</li>
      <li>Settings</li>
      <li>About</li>
    </ul>
  </div>
</div>
