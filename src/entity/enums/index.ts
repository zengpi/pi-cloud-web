/**
 * storage key
 */
enum LocalStorageEnum {
    /**
     * 语言
     */
    LANGUAGE = "language",
    /**
     * 尺寸
     */
    SIZE = "size",
    /**
     * 访问令牌
     */
    TOKEN = "token",
    /**
     * 侧边栏状态
     */
    SIDEBAR_STATUS = "sidebar_collapsed"
}

/**
 * 组件尺寸
 */
enum ComponentsSizeEnum {
    SMALL = "small",
    DEFAULT = "default",
    LARGE = "large"
}

/**
 * 语言
 */
enum LocaleEnum {
    /**
     * 中文
     */
    ZH = "zh",
    /**
     * 英文
     */
    EN = "en"
}

/**
 * 菜单类型
 */
enum MenuTypeEnum {
    /**
     * 目录
     */
    DIR = 1,
    /**
     * 菜单
     */
    MENU,
    /**
     * 按钮
     */
    BUTTON
}

export { LocalStorageEnum, ComponentsSizeEnum, LocaleEnum, MenuTypeEnum }