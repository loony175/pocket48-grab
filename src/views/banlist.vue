<template>
  <div>
    <h1># 屏蔽词查询</h1>
    <cDivider/>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 10}"
          placeholder="请输入内容"
          v-model="text"
        ></el-input>
      </el-col>
<!--       <el-col :xs="24" :sm="12">
        <el-button type="warning" round @click="dialog = true">屏蔽词列表</el-button>
      </el-col> -->
    </el-row>
<!--     <el-dialog title="屏蔽词列表" :visible.sync="dialog">
      {{ banlist.join(" ") }}
    </el-dialog> -->
    <cDivider/>
    <el-alert
      v-if="ban === undefined || ban.length == 0"
      type="success"
      show-icon
      :closable="false"
    >检测通过</el-alert>
    <div v-else>
      <el-alert type="error" show-icon :closable="false">存在屏蔽词 {{ ban.join(' ') }}</el-alert>
      <p>{{ edit }}</p>
    </div>
    <cDivider/>
  </div>
</template>
<script>
import cDivider from "@/components/cDivider";
import banlist from "static/banlist.js";
export default {
  name: "banlist",
  data() {
    return {
      text: "",
      dialog: false
    };
  },
  computed: {
    ban() {
      var match = [];
      banlist.forEach(word => {
        if (this.text.indexOf(word) !== -1 && word != "") {
          match.push(word);
        }
      });
      return match;
    },
    edit() {
      var text = this.text;
      this.ban.forEach(word => {
        var regExp = new RegExp(word, "g");
        text = text.replace(regExp, "**");
      });
      return text;
    }
  },
  components: { cDivider }
};
</script>