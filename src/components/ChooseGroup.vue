/* 团体选择器 ChooseGroup */
<template>
  <el-select v-model="value" filterable placeholder="选择团...">
    <el-option v-for="item in data" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      value: ""
    };
  },
  computed: {
    data() {
      var info = this.GLOBAL.info;
      var data = [{value: 0, label: '全团'}];
      try {
        /* group */
        info.groupInfo.forEach(group => {
          data.push({
            value: group.groupId,
            label: group.groupName
          });
        });
      } catch (e) {
        console.log(e);
      }
      return data;
    }
  }
};
</script>