/**
 * 自定义指令实现按钮动态显示
 *
 * hasAnyAuthority: 如果当前主体具有任何提供的授权(以逗号分隔的字符串列表给出)则显示元素。
 * hasAuthority: 如果当前主体具有指定的权限，则显示元素。
 * hasAnyRole: 如果当前主体具有任何提供的角色(以逗号分隔的字符串列表给出)则显示元素。
 * hasRole：如果当前主体具有指定的角色，则显示元素。
 *
 * @author ZnPi
 * @date 2022-09-27
 */
import useStore from "@/stores";

const hasAnyAuthority = () => {
  const { useUserStore } = useStore();
  return getDirective("v-has-any-authority=\"['sys:user:add']", (el, value) => {
    if (!useUserStore.authorities?.some((e) => value.includes(e))) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  });
};

const hasAuthority = () => {
  const { useUserStore } = useStore();
  return getDirective("v-has-authority=\"['sys:user:add']\"", (el, value) => {
    if (
      !value.every(
        (e: any) =>
          useUserStore.authorities && useUserStore.authorities.includes(e)
      )
    ) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  });
};

const hasAnyRole = () => {
  const { useUserStore } = useStore();
  return getDirective("v-has-any-role=\"['sys:user:add']\"", (el, value) => {
    if (!useUserStore.roles?.some((e) => value.includes(e))) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  });
};

const hasRole = () => {
  const { useUserStore } = useStore();
  return getDirective("v-has-role=\"['sys:user:add']\"", (el, value) => {
    if (!useUserStore.roles?.every((e) => value.includes(e))) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  });
};

const getDirective = (
  permissionExample: string,
  callbackfn: (el: any, value: any) => unknown
) => {
  if (!callbackfn) throw new TypeError("undefined is not a function");
  if (typeof callbackfn !== "function") {
    throw new TypeError(callbackfn + " is not a function");
  }
  return {
    mounted: (el: any, binding: any) => {
      const { value } = binding;
      if (value) {
        callbackfn(el, value);
      } else {
        throw new Error("请指定权限参数，如：" + permissionExample);
      }
    },
  };
};

export { hasAnyAuthority, hasAuthority, hasAnyRole, hasRole };
