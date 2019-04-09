/* 设置-开启颜色 */
<template>
  <div>
    <el-form-item label="开启颜色">
      <el-switch v-model="isColor"></el-switch>
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
    isColor: {
      get(){
        return this.sharedState.GLOBAL.config.isColor
      },
      set(newVal) {
        this.GLOBAL.config.isColor = newVal;
        this.GLOBAL.saveConfig();
      }
    }
  },
  components: {}
};
</script>