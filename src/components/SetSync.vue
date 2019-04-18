/* 设置-同步 */
<template>
  <div>
    <el-form-item label="开启颜色">
      <el-switch v-model="isAutoSync"></el-switch>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: "SetSync",
  data() {
    return {
      isAutoSync: this.GLOBAL.config.isAutoSync
    };
  },
  methods: {},
  watch: {
    isAutoSync: {
      handler: function(newVal, oldVal) {
        this.GLOBAL.config.isAutoSync = newVal;
        this.GLOBAL.saveConfig();
      }
    }
  },
  components: {}
};
</script>