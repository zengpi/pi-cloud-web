<script setup name="SystemRole" lang="ts">
import { ref } from "vue"
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import { ComponentProps } from "@/entity"

import Role from "./Role.vue"
import RoleMember from "./RoleMember.vue"
import MenuAllocation from "./MenuAllocation.vue"

const componentProps = ref<ComponentProps>(new ComponentProps())

</script>

<template>
    <div class="app-container">
        <Splitpanes class="default-theme">
            <Pane size="60" min-size="50" max-size="70" style="padding-right: 10px;">
                <Role v-model:component-props="componentProps" />
            </Pane>
            <Pane>
                <el-tabs tab-position="top" class="demo-tabs">
                    <el-tab-pane label="角色成员">
                        <RoleMember :component-props="componentProps" />
                    </el-tab-pane>
                    <el-tab-pane label="菜单分配">
                        <MenuAllocation :component-props="componentProps"/>
                    </el-tab-pane>
                </el-tabs>
            </Pane>
        </Splitpanes>
    </div>
</template>
