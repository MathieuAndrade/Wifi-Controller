/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

const Log = {
  default(text) {
    console.log('\n---\n\n\x1b[7m.: %s :.\x1b[0m\n', text.toUpperCase());
  },

  title(text) {
    console.log('\n---\n\n\x1b[7m.: %s :.\x1b[0m\n', text.toUpperCase());
  },

  info(text) {
    console.info('\x1b[36m➡ %s\x1b[0m', text);
  },

  success(text) {
    console.log('\x1b[32m✔ %s\x1b[0m', text);
  },

  warning(text) {
    console.warn('\x1b[33m❗ %s\x1b[0m', text);
  },

  error(text) {
    console.trace('\x1b[31m✖ %s\x1b[0m', text);
  },
};

export default Log;
