<script lang="js">
  import Icon from '@iconify/svelte';
  import { link } from 'svelte-spa-router';

  import { modalToOpen, url, ws } from '../../utils/store';

  import _ from '../../utils/i18n';

  import LocoList from '../LocoList.svelte';
</script>

<div class="drawer drawer-mobile">
  <input id="dashboard-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <slot />
  </div>

  <div class="drawer-side">
    <label for="dashboard-drawer" class="drawer-overlay"></label>

    <aside class="bg-base-200 w-80">
      <div
        class="z-20 bg-base-200 bg-opacity-90 backdrop-blur sticky top-0 items-center gap-2 px-4 py-2 flex justify-center pt-4">
        <span class="header-lg text-lg font-bold">
          {$_('dashboardTitle')}
        </span>
      </div>

      <div class="form-control px-4">
        <label for="address" class="label">
          <span class="label-text">{$_('ipAddress')} :</span>
        </label>
        <div class="input-group">
          <input
            id="address"
            name="address"
            type="text"
            placeholder="192.168.0.155:81"
            class="input input-bordered input-sm {!$ws
              ? 'input-error'
              : 'input-success'}"
            bind:value="{$url}" />
          <button
            class="btn btn-square btn-sm px-2 w-auto {!$ws
              ? 'btn-error'
              : 'btn-success'}"
            on:click="{() => modalToOpen.set('connexionModal')}">
            {!$ws ? `${$_('connect')}` : `${$_('connected')}`}
          </button>
        </div>
      </div>

      <ul class="menu flex flex-col p-0 px-4">
        <li></li>
        <li>
          <a use:link href="/dashboard/locomotive" class="flex gap-4">
            <span class="flex-none">
              <Icon icon="cil:locomotive" class="w-6 h-6" />
            </span>
            <span class="flex-1">{$_('locomotive')}</span>
          </a>
        </li>
        <!--
        <li>
          <a
            use:link
            href="/dashboard/feedback"
            class="flex gap-4">
            <span class="flex-none">
              <Icon icon="material-symbols:all-out-outline-rounded" class="w-6 h-6"/>
            </span>
            <span class="flex-1">{$_('feedback')}</span>
          </a>
        </li>
        <li>
          <a
            use:link
            href="/dashboard/accessories"
            class="flex gap-4">
            <span class="flex-none">
              <Icon icon="material-symbols:alt-route-rounded" class="w-6 h-6"/>
            </span>
            <span class="flex-1">{$_('accessories')}</span>
          </a>
        </li>
        -->
      </ul>

      <LocoList />
    </aside>
  </div>
</div>
