import { ref } from 'vue'
import { defineStore } from 'pinia'

import { getLocale } from '@/locale'
import { localStorage } from '@/util/storage';
import { LocalStorageEnum, ComponentsSizeEnum } from "@/entity/enums"

const useAppStore = defineStore('app', () => {
    /**
     * 语言
     */
    const locale = ref(getLocale())
    /**
     * 尺寸
     */
    const size = ref(localStorage.get(LocalStorageEnum.SIZE) || ComponentsSizeEnum.DEFAULT)
    /**
     * 侧边栏是否折叠
     */
    const sidebarCollapsed = ref(localStorage.get(LocalStorageEnum.SIDEBAR_STATUS) || false)

    /**
     * 折叠/展开侧边栏
     */
    function toggleSidebar() {
        sidebarCollapsed.value = !sidebarCollapsed.value;

        localStorage.set(LocalStorageEnum.SIDEBAR_STATUS, sidebarCollapsed.value);
    }
    /**
     * 设置语言
     * @param lang 待设置的语言
     */
    function setLocale(lang: string) {
        locale.value = lang;
        localStorage.set(LocalStorageEnum.LANGUAGE, lang);
    }

    function setSize(targetSize: string) {
        size.value = targetSize;
        localStorage.set(LocalStorageEnum.SIZE, targetSize);
    }

    return { locale, size, sidebarCollapsed, toggleSidebar, setLocale, setSize }
})

export default useAppStore;