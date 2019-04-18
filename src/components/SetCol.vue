/* 设置-表格收缩 */
<template>
  <div>
    <el-form-item label="表格收缩">
      <el-switch v-model="isCol"></el-switch>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: "SetCol",
  data() {
    return {
      sharedState: {GLOBAL: this.GLOBAL}
    };
  },
  computed: {
    isCol: {
      get(){
        return this.sharedState.GLOBAL.config.isCol
      },
      set(newVal) {
        this.sharedState.GLOBAL.config.isCol = newVal;
        this.GLOBAL.saveConfig();
      }
    }
  },
  components: {}
};
</script>