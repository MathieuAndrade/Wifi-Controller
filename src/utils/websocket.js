/* eslint-env browser */
import log from './log';
import { event } from './store';

const dccLogs = [];

const websocket = (url) => {
  const socket = new WebSocket(`ws://${url}/ws`);

  // Timeout to close automatically connection if server not responding
  const timeout = setTimeout(() => socket.close(), 5000);

  socket.onopen = (_e) => {
    clearTimeout(timeout);
    log.success('[Connect] Connection established');
    event.emit('connected');
  };

  socket.onmessage = (e) => {
    log.info(`[Message] Data received from server: ${e.data}`);

    // Tru to parse data at JSON object
    try {
      event.emit('message', JSON.parse(e.data));
    } catch (err) {
      // If error was thrown out because message was not JSON object
      // so send it is a message from DCCpp
      if (e.data.startsWith('<') && e.data.endsWith('>')) {
        event.emit('dccMessage', e.data);

        // Save dcc message to share it with logs window
        dccLogs.push(`DCCpp : ${e.data.replace(/<|>/g, '')}`);
        localStorage.setItem('dccLogs', JSON.stringify(dccLogs));
      }
    }
  };

  socket.onclose = (e) => {
    if (e.wasClean) {
      log.info(
        `[Close] Connection closed cleanly, code=${e.code} reason=${e.reason}`,
      );
    } else {
      log.warning('[Close] Connection died');
    }
    event.emit('close');
  };

  socket.onerror = (error) => {
    log.error(`[Error] ${error.message}`);
    event.emit('error', error.message);
  };

  return socket;
};

export default websocket;
