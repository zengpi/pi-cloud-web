<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { uuid } from 'vue-uuid'
import { User, Lock, Checked } from "@element-plus/icons-vue"
import type { FormInstance } from "element-plus"
import { useRoute } from "vue-router"

import useStore from "@/stores"
import router from '@/router';

import { LoginForm } from '@/entity/system/user'

import { login } from '@/api/system/user'

import LocaleSelect from "@/components/LocaleSelect.vue"

const loading = ref(false)
const formRef = ref<FormInstance>()
const loginForm = ref(new LoginForm())
const loginRules = {
    username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
    password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
    code: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
}

const captchaUrl = ref<string>()

const { useUserStore } = useStore()
const route = useRoute()

const redirect = computed(() => {
    let redirect = route.query.redirect;
    if (redirect) return redirect as string;

    return "/";
})

function handleLogin(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            loading.value = true;
            login(loginForm.value).then((response) => {
                const { access_token, token_type } = response.data;
                const accessToken = token_type + ' ' + access_token;
                useUserStore.setToken(accessToken)
                router.push({ path: redirect.value })
                loading.value = false;
            }).catch(() => {
                loading.value = false;
                refreshCaptcha()
            })

        }
    })
}

function refreshCaptcha() {
    let randomCode = uuid.v1()
    loginForm.value.randomCode = randomCode
    captchaUrl.value = `${window.location.origin}${import.meta.env.VITE_APP_BASE_API}/captcha/${randomCode}`
}

onMounted(() => {
    refreshCaptcha()
}) 
</script>

<template>
    <div class="login-container">
        <el-form ref="formRef" :model="loginForm" :rules="loginRules" label-width="0px" class="login-form">
            <div class="title-container">
                <h3 class="title">{{ $t('login.title') }}</h3>
                <LocaleSelect />
            </div>
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" :prefix-icon="User" auto-complete="off"
                    :placeholder="$t('login.username')" />
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" :prefix-icon="Lock" auto-complete="off"
                    :placeholder="$t('login.password')" @keyup.enter.native="handleLogin(formRef)" />
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="loginForm.code" :prefix-icon="Checked" auto-complete="off"
                    :placeholder="$t('login.code')" style="width: 63%" @keyup.enter.native="handleLogin(formRef)" />
                <div class="captcha">
                    <img :src="captchaUrl" @click="refreshCaptcha">
                </div>
            </el-form-item>
            <el-form-item style="width:100%;">
                <el-button :loading="loading" type="primary" style="width:100%;" @click="handleLogin(formRef)">
                    <span v-if="!loading">{{ $t('login.login') }}</span>
                    <span v-else>{{ $t('login.logining') }}</span>
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.login-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #001e3a;

    .login-form {
        width: 320px;
        padding: 25px 25px 5px 25px;
        background-color: #fff;
        border-radius: 6px;

        .title-container {
            display: flex;
            margin-bottom: 30px;

            .title {
                margin: 0 auto;
            }
        }

        .captcha {
            width: 33%;
            height: 32px;
            margin-left: 12px;

            img {
                cursor: pointer;
            }
        }
    }
}
</style>