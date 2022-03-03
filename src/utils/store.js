/* eslint-env browser */
import { writable } from 'svelte/store';
import Event from './eventEmitter';

const storedUrl = localStorage.getItem('server-address');

/** Reactive vars */

const url = writable(storedUrl || window.location.host);
const ws = writable(null);
const locos = writable([]);
const selectedLoco = writable({});
const indexOfSelectedLoco = writable(-1);
const hasDataToSave = writable(false);
const indexOfLocoToDelete = writable(-1);
const dccLogs = writable([]);

const powerState = writable(false);
const log = writable('');

/** Static vars */

// Random number for read/write cv
const cvId = Math.floor(Math.random() * 100) + 200;
// Event emitter used by websocket helper and lot of components
const event = new Event();

export {
  url,
  ws,
  event,
  locos,
  selectedLoco,
  indexOfSelectedLoco,
  hasDataToSave,
  cvId,
  powerState,
  log,
  indexOfLocoToDelete,
  dccLogs,
};
