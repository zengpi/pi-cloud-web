import clone from "xe-utils/clone";
import type { PiniaPlugin, PiniaPluginContext } from "pinia";

const resetState: PiniaPlugin = (context: PiniaPluginContext) => {
  const { store } = context;
  const initialState = clone(store.$state, true);
  store.$reset = () => {
    store.$state = clone(initialState, true);
  };
};

export { resetState };
