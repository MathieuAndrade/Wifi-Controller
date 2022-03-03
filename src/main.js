/* eslint-env browser */

import App from './App.svelte';
import './assets/css/index.css';
import './assets/css/cursor.css';

import './utils/i18n';

const app = new App({
  target: document.body,
});

export default app;
