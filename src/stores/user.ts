import { ref } from 'vue';
import { defineStore } from 'pinia';

import useStore from '@/stores';

import { localStorage } from '@/util/storage';
import { LocalStorageEnum } from '@/entity/enums';

import { getUserInfo as getUserInfoApi } from "@/api/system/user"

const useUserStore = defineStore('user', () => {
    /**
     * 用户名
     */
    const username = ref('');
    /**
     * 昵称
     */
    const nickname = ref('');
    /**
     * 手机
     */
    const phone = ref('');
    /**
     * 头像
     */
    const avatar = ref('');
    /**
     * 角色
     */
    const roles = ref<string[]>([])
    /**
     * 权限
     */
    const authorities = ref<string[]>([])
    /**
     * 访问令牌
     */
    const token = ref(localStorage.get(LocalStorageEnum.TOKEN) || '');

    /**
     * 设置访问令牌
     * @param accessToken 访问令牌
     */
    function setToken(accessToken: string) {
        token.value = accessToken;
        localStorage.set(LocalStorageEnum.TOKEN, accessToken);
    }
    
    /**
     * 获取用户信息
     * @returns /
     */
    function getUserInfo() {
        return new Promise((resolve, reject) => {
            getUserInfoApi().then(({ data }) => {
                const { userInfo } = data;
                username.value = userInfo.username;
                nickname.value = userInfo.nickname;
                phone.value = userInfo.phone;
                avatar.value = userInfo.avatar;
                roles.value = data.roles;
                authorities.value = data.authorities;
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        });
    }

    /**
     * 重置 store 和 token
     * @returns /
     */
    function reset() {
        return new Promise((resolve) => {
            const { useUserStore } = useStore()
            useUserStore.$reset();
            token.value = ""

            localStorage.remove(LocalStorageEnum.TOKEN);
            resolve(null);
        });
    }

    return { username, nickname, phone, avatar, authorities, roles, token, setToken, getUserInfo, reset };
})

export default useUserStore;