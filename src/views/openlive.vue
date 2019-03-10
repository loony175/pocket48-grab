<template>
  <div>
    <h1># 公演直播&录播</h1>
    <cDivider/>
    <!-- 日期、数量选择器 -->
    <ChoosePram ref="choosePram" @submit="submit"/>
    <!-- 团体选择器 -->
    <ChooseGroup ref="chooseGroup"/>
    <!-- 提交 -->
    <el-button type="primary" @click="submit">提交</el-button>
    <cDivider/>

    <TableOpenliveCtr ref="TableOpenliveCtr"/>

    <el-alert v-if="GLOBAL.debug" type="success" :closable="false">
      最终提交:
      timeChoose: {{ timeChoose }}
      <br>
      timestring: {{ timestring }}
      <br>
      limit: {{ limit }}
      <br>
      groupId: {{ groupId }}
      <br>
    </el-alert>
  </div>
</template>
<script>
import ChooseGroup from "@/components/ChooseGroup";
import ChoosePram from "@/components/ChoosePram";
import TableOpenliveCtr from "@/components/TableOpenliveCtr";
import cDivider from "@/components/cDivider";
export default {
  name: "live",
  data() {
    return {
      timeChoose: "0",
      timestring: 0,
      limit: 50,
      groupId: 0
    };
  },
  methods: {
    submit() {
      this.timeChoose = this.$refs.choosePram.timeChoose;
      this.timestring =
        this.$refs.choosePram.timeChoose == "1"
          ? this.$refs.choosePram.time.getTime()
          : 0;
      this.limit = this.$refs.choosePram.limit;
      this.groupId = this.$refs.chooseGroup.value || 0;
      /* 向TableOpenliveCtr组件提交表单 */
      this.$refs.TableOpenliveCtr.getLive({
        isReview: 1,
        groupId: this.groupId,
        userId: 0,
        lastGroupId: 0,
        lastTime: this.timestring,
        type: 0,
        giftUpdTime: 1498211389003,
        limit: this.limit
      });
      this.$refs.TableOpenliveCtr.getLive({
        isReview: 0,
        groupId: this.groupId,
        userId: 0,
        lastGroupId: 0,
        lastTime: 0,
        type: 0,
        giftUpdTime: 1498211389003,
        limit: this.limit
      });
    }
  },
  components: { ChooseGroup, ChoosePram, TableOpenliveCtr, cDivider }
};
</script>