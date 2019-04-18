<template>
  <div>
    <h1># 成员直播&录播</h1>
    <cDivider/>
    <!-- 日期、数量选择器 -->
    <ChoosePram ref="choosePram" @submit="submit"/>
    <!-- 成员选择器 -->
    <ChooseMember ref="chooseMember"/>
    <!-- 提交 -->
    <el-button type="primary" @click="submit">提交</el-button>
    <cDivider/>

    <TableLiveCtr ref="TableLiveCtr"/>
    
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
import ChooseMember from "@/components/ChooseMember";
import ChoosePram from "@/components/ChoosePram";
import TableLiveCtr from "@/components/TableLiveCtr";
import cDivider from "@/components/cDivider";
export default {
  name: "live",
  data() {
    return {
      next: "0",
      groupId: 0,
      teamId: 0,
      memberId: 0,
    };
  },
  methods: {
    submit() {
      this.next = this.$refs.choosePram.next;

      /* 如果没有选择member, 删除team选择 */
/*       if (
        !this.$refs.chooseMember.value[2] &&
        this.$refs.chooseMember.value[1]
      ) {
        this.$refs.chooseMember.value.pop();
      } */

      /* 如果选择了member, 则设置groupId=0, teamId=0 */
      if (this.$refs.chooseMember.value[2]) {
        this.groupId = 0;
        this.teamId = 0;
      } else {
        this.groupId = this.$refs.chooseMember.value[0] || 0;
        this.teamId = this.$refs.chooseMember.value[1] || 0;
      }
      this.memberId = this.$refs.chooseMember.value[2] || 0;

      /* 向TableLiveCtr组件提交表单 */
      this.$refs.TableLiveCtr.getLive({
        next: this.next,
        record: "false",
        teamId: this.teamId,
        userId: this.memberId,
        groupId: this.groupId
      });
      
      this.$refs.TableLiveCtr.getLive({
        next: this.next,
        record: "true",
        teamId: this.teamId,
        userId: this.memberId,
        groupId: this.groupId
      });
    }
  },
  components: { ChooseMember, ChoosePram, TableLiveCtr, cDivider }
};
</script>