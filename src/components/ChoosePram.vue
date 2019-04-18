<template>
  <el-form @submit.native.prevent="submit" :style="{display:'inline-block'}" :inline="true">
    <el-input v-model="next" placeholder="Next参数...不会填就留空..."></el-input>
  </el-form>
</template>
<script>
export default {
  name: "ChoosePram",
  data() {
    return {
      next: ""
    };
  },
  methods: {
    submit() {
      this.$emit("submit");
    }
  }
};
</script>