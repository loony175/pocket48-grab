/* 设置-反向显示 */
<template>
  <div>
    <el-form-item label="反向显示">
      <el-switch v-model="isReverse"></el-switch>
      房间中, 最新的消息在{{isReverse?('最上面'):('最下面')}}
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: "SetReverse",
  data() {
    return {
      sharedState: {GLOBAL: this.GLOBAL}
    };
  },
  computed: {
    isReverse: {
      get(){
        return this.sharedState.GLOBAL.config.isReverse
      },
      set(newVal) {
        this.sharedState.GLOBAL.config.isReverse = newVal;
        this.GLOBAL.saveConfig();
      }
    }
  },
  components: {}
};
</script>