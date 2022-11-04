/*
 * 校验工具
 * @author ZnPi
 * @date 2022-09-16
 */
/**
 * office excel 后缀模式
 */
const SHEET_SUFFIX_PATTERN = /\.(xlsx|xls)$/i;

/**
 * 手机号模式
 */
const PHONE_PATTERN = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;

/**
 * 是否是 office 的 excel 类型文件
 * @param filename 
 */
function isSheet (filename: string) {
  if (SHEET_SUFFIX_PATTERN.test(filename)) {
    return true;
  }
  return false;
}

/**
 * 是否不是 office 的 excel 类型文件
 * @param filename 
 */
function isNotSheet (filename: string) {
  return !isSheet(filename)
}

function isPhone (phone: string) {
  if (PHONE_PATTERN.test(phone)) {
    return true;
  }
  return false;
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
function isExternalLink(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

export { isSheet, isNotSheet, isPhone, isExternalLink }