import { ElLoading } from "element-plus";

export function getLoading(): {
  setText: (text: string) => void;
  removeElLoadingChild: () => void;
  close: () => void;
  handleAfterLeave: () => void;
  vm: import("vue").ComponentPublicInstance<
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    false,
    import("vue").ComponentOptionsBase<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      {}
    >
  >;
  $el: HTMLElement;
  originalPosition: import("vue").Ref<string>;
  originalOverflow: import("vue").Ref<string>;
  visible: import("vue").Ref<boolean>;
  parent: import("vue").Ref<
    import("element-plus/es/components/loading/src/types").LoadingParentElement
  >;
  background: import("vue").Ref<string>;
  svg: import("vue").Ref<string>;
  svgViewBox: import("vue").Ref<string>;
  spinner: import("vue").Ref<string | boolean>;
  text: import("vue").Ref<string>;
  fullscreen: import("vue").Ref<boolean>;
  lock: import("vue").Ref<boolean>;
  customClass: import("vue").Ref<string>;
  target: import("vue").Ref<HTMLElement>;
  beforeClose?: import("vue").Ref<(() => boolean) | undefined> | undefined;
  closed?: import("vue").Ref<(() => void) | undefined> | undefined;
} {
  return ElLoading.service({
    lock: true,
    text: "拼命加载中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
}
