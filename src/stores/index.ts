import useAppStore from "./app";
import useUserStore from "./user";
import useRouterStore from "./router";
import useTabStore from "./tab";

const useStore = () => ({
  useAppStore: useAppStore(),
  useUserStore: useUserStore(),
  useRouterStore: useRouterStore(),
  useTabStore: useTabStore(),
});

export default useStore;
