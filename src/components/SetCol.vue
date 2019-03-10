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
      isCol: this.GLOBAL.config.isCol
    };
  },
  methods: {},
  watch: {
    isCol: {
      handler: function(newVal, oldVal) {
        this.$set(this.GLOBAL.config, "isCol", newVal);
        this.GLOBAL.saveConfig();
      }
    }
  },
  components: {}
};
</script>