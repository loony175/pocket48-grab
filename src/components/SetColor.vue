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
      isColor: this.GLOBAL.config.isColor
    };
  },
  methods: {},
  watch: {
    isColor: {
      handler: function(newVal, oldVal) {
        this.GLOBAL.config.isColor = newVal;
        this.GLOBAL.saveConfig();
      }
    }
  },
  components: {}
};
</script>