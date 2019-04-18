<template>
  <div>
    <h1># 用户查询</h1>
    <cDivider/>
    <el-form :style="{display:'inline-block'}" @submit.native.prevent="submit" :inline="true">
      <el-form-item>
        <el-input placeholder="用户id(口袋号,数字)" v-model="userId" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="submit" circle></el-button>
      </el-form-item>
    </el-form>
    <cDivider/>

    <!-- 用户信息 -->
    <InfoUser :item="userInfo"/>
  </div>
</template>
<script>
import InfoUser from "@/components/InfoUser";
import cDivider from "@/components/cDivider";
import axios from "axios";
export default {
  name: "user",
  data() {
    return {
      userId: null,
      userInfo: {}
    };
  },
  methods: {
    submit() {
      this.getUser({
        userId: this.userId+"",
        needMuteInfo: "True"
      });
    },
    getUser(
      req = {
        userId: "0",
        needMuteInfo: "True"
      }
    ) {
      /* 提交表单 获取用户信息 */
      axios({
        url: this.GLOBAL.api.userhome,
        method: "post",
        headers: {},
        data: req
      })
        .then(response => {
          this.upUser(response.data, req);
        })
        .catch(e => {
          console.log(e);
        });
    },
    upUser(res, req) {
      /* 回调用户信息 */
      this.$set(this.userInfo,'userInfo',res.content.baseUserInfo);
      console.log(this.userInfo);
      console.log(res, req);
    }
  },
  components: { InfoUser, cDivider }
};
</script>