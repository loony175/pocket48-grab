<template>
  <el-form  @submit.native.prevent="submit" :style="{display:'inline-block'}" :inline="true">截止时间:
    <el-radio v-model="timeChoose" label="0">当前</el-radio>
    <el-radio v-model="timeChoose" label="1">选择时间</el-radio>
    <el-date-picker
      v-model="time"
      type="datetime"
      :disabled="(timeChoose=='0')"
      placeholder="选择日期时间"
    ></el-date-picker>数量上限:
    <el-input-number v-model="limit" :min="1" :max="1000"></el-input-number>
  </el-form >
</template>
<script>
export default {
  name: "ChoosePram",
  data() {
    return {
      timeChoose: "0",
      time: new Date(),
      limit: 50
    };
  },
  methods: {
    submit() {
      this.$emit("submit");
    }
  }
};
</script>