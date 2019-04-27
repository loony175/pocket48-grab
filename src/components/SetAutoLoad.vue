/* 设置-加载更多 */
<template>
  <div>
    <el-form-item label="自动加载">
      <el-switch v-model="isAutoLoad"></el-switch>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: "SetColor",
  data() {
    return {
      sharedState: {GLOBAL: this.GLOBAL}
    };
  },
  computed: {
    isAutoLoad: {
      get(){
        return this.sharedState.GLOBAL.config.isAutoLoad
      },
      set(newVal) {
        this.GLOBAL.config.isAutoLoad = newVal;
        this.GLOBAL.saveConfig();
      }
    }
  },
  components: {}
};
</script>