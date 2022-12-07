<script setup lang="ts">
import ErrGif from "../../assets/images/err.gif";

withDefaults(
  defineProps<{
    desc?: string;
    code?: string;
  }>(),
  {
    desc: "我们似乎无法找到您要的页面。",
    code: "404",
  }
);
</script>

<template>
  <div class="err-page-container">
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo">糟糕！</h1>
        <h2>{{ desc }}</h2>
        <h6>错误代码：{{ code }}</h6>
        <ul class="list-unstyled">
          <li>下面是一些有用的链接：</li>
          <li class="link-type">
            <RouterLink to="/dashboard">首页</RouterLink>
          </li>
          <li>
            <a href="https://www.airbnb.cn/111">GIF 出处</a>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img
          :src="ErrGif"
          width="313"
          height="428"
          alt="小女孩的冰淇淋掉在地上。"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.err-page-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
}

.text-jumbo {
  font-size: 80px;
  font-weight: 700;
  color: #484848;
  margin-bottom: 15px;
}

.list-unstyled {
  padding-left: 0;
  font-size: 14px;
  list-style: none;

  li {
    padding-bottom: 5px;
  }

  a {
    color: #008489;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
