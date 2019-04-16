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
      next: {{ next }}
      <br>
      teamId: {{ teamId }}
      <br>
      groupId: {{ groupId }}
      <br>
      memberId: {{ memberId }}
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
      next: "",
      groupId: 0,
      teamId: 0,
      memberId: 0,
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
      this.teamId = 0;
      this.memberId = 0;
      this.groupId = this.$refs.chooseGroup.value || 0;
      /* 向TableOpenliveCtr组件提交表单 */
      this.$refs.TableOpenliveCtr.getLive({
        next: this.next,
        record: "false",
        teamId: this.teamId,
        userId: this.memberId,
        groupId: this.groupId
      });
      this.$refs.TableOpenliveCtr.getLive({
        next: this.next,
        record: "true",
        teamId: this.teamId,
        userId: this.memberId,
        groupId: this.groupId
      });
    }
  },
  components: { ChooseGroup, ChoosePram, TableOpenliveCtr, cDivider }
};
</script>