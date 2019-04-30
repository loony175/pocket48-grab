<template>
  <div>
    <h1># 设置</h1>
    <cDivider/>
    <el-form ref="form" label-width="80px">
      <SetCol/>
      <SetColor/>
      <SetAutoLoad/>
    </el-form>
  </div>
</template>
<script>
import cDivider from "@/components/cDivider";
import SetCol from "@/components/SetCol";
import SetColor from "@/components/SetColor";
import SetAutoLoad from "@/components/SetAutoLoad";
export default {
  name: "setting",
  data() {
    return {};
  },
  methods: {},
  watch: {},
  components: { cDivider, SetCol, SetColor, SetAutoLoad }
};
</script>