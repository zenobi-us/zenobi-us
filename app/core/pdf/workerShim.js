/* global WorkerGlobalScope */
/* eslint-disable no-restricted-globals */
if (
  typeof WorkerGlobalScope !== 'undefined' &&
  self instanceof WorkerGlobalScope
) {
  self.global = self;
  self.window = self;
}

if (import.meta.hot) {
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => {
    return (type) => {
      return type;
    };
  };
  window.__vite_plugin_react_preamble_installed__ = true;
}
