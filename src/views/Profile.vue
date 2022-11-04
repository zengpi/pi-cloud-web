<script setup name="profile" lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { type FormInstance, type FormRules, ElMessage } from 'element-plus';
import MyUpload from 'vue-image-crop-upload';

import { User } from "@/entity/system/user"

import { profileEdit } from "@/api/system/user"

import { isPhone } from "@/util/validate"
import { localStorage } from '@/util/storage';

import useStore from "@/stores"

let comfirmLoading = ref<Boolean>()

let formData = ref<User>(new User())

const form = ref<FormInstance>()

const checkPhone = (rule: any, value: any, callback: any) => {
    if (value && !isPhone(value)) {
        callback(new Error("输入的手机号不合法"));
    }
    callback();
}
const validOldPass = (rule: any, value: any, callback: any) => {
    if (formData.value.password && !value) {
        callback(new Error("请输入旧密码"))
    }
    callback();
}
const validPass = (rule: any, value: any, callback: any) => {
    if (value !== '' && comfirmPass.value) {
        if (!form.value) return;
        form.value.validateField("comfirmPass", () => { })
    }
    if (value !== '' && !formData.value.oldPassword) {
        if (!form.value) return;
        form.value.validateField("oldPassword", () => { })
    }
    callback();
}
const validConfirmPass = (rule: any, value: any, callback: any) => {
    if (formData.value.password && comfirmPass.value === '') {
        callback(new Error("请再次输入密码"))
    } else if (comfirmPass.value !== formData.value.password) {
        callback(new Error("两次输入的密码不一致"))
    }
    if (value !== '' && !formData.value.oldPassword) {
        if (!form.value) return;
        form.value.validateField("oldPassword", () => { })
    }
    callback()
}

const rules = ref<FormRules>({
    nickname: [
        { required: true, message: "昵称不能为空", trigger: "blur" }
    ],
    phone: [
        { validator: checkPhone, trigger: "blur" }
    ],
    oldPassword: [
        { validator: validOldPass, trigger: "blur" }
    ],
    password: [
        { validator: validPass, trigger: "blur" }
    ],
    comfirmPass: [
        { validator: validConfirmPass, trigger: "blur" }
    ]

})

let comfirmPass = ref('');

const errorHandler = () => true

let show = ref(false)

let imgDataUrl = ref('') // the datebase64 url of created image

let headers = ({
    Authorization: localStorage.get('token')
})

const uploadAvatarUrl = `${import.meta.env.VITE_APP_BASE_API}/admin/user/uploadAvatar`

const { useUserStore } = useStore();

const avatar = computed(() => useUserStore.avatar)

const handleComfirm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            comfirmLoading.value = true;
            profileEdit(formData.value).then(() => {
                ElMessage({
                    type: "success",
                    message: "修改成功"
                });
                useUserStore.getUserInfo()
                comfirmLoading.value = false;
            }).catch(() => {
                comfirmLoading.value = false;
            })
        }
    })
}

function handleReset() {
    formData.value = new User();
    comfirmPass.value = "";
    form.value?.resetFields();
    initFormData();
}

function initFormData() {
    formData.value.username = useUserStore.username;
    formData.value.nickname = useUserStore.nickname;
    formData.value.phone = useUserStore.phone;
    imgDataUrl.value = useUserStore.avatar;
}

function cropSuccess(url: any, field: any) {
    imgDataUrl.value = url;
}

function cropUploadSuccess() {
    useUserStore.getUserInfo();
}

function cropUploadFail() {
    imgDataUrl.value = useUserStore.avatar;
}

function toggleShow() {
    show.value = !show.value;
}

onMounted(() => {
    initFormData()
});
</script>

<template>
    <div class='app-container'>
        <el-form ref="form" :model="formData" :rules="rules" label-width="85px" style="width: 500px">
            <el-form-item label="头像" prop="username">
                <el-avatar shape="square" :size="100" fit="fill" :src="imgDataUrl" @error="errorHandler"
                    @click="toggleShow" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formData.username" autocomplete="off" disabled />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="formData.nickname" autocomplete="off" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="formData.phone" autocomplete="off" />
            </el-form-item>
            <el-form-item label="原密码" prop="oldPassword">
                <el-input type="password" v-model="formData.oldPassword" autocomplete="off" />
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input type="password" v-model="formData.password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="comfirmPass">
                <el-input type="password" v-model="comfirmPass" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleComfirm(form)" :loading="comfirmLoading">确认</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
        <MyUpload :no-rotate="false" field="file" @crop-success="cropSuccess" @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail" v-model="show" :width="300" :height="300" :url="uploadAvatarUrl"
            :params="{username: formData.username, avatar: avatar}" :headers="headers" img-format="png">
        </MyUpload>
    </div>
</template>

<style scoped lang="scss">
.el-avatar {
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    overflow: hidden;
    background: none;
}

.el-avatar:hover {
    border-color: #1E90FF;
}
</style>