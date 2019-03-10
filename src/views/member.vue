 <style>
.c-layout-p .c-table {
  max-height: 80vh;
  overflow: scroll;
}
</style>
<template>
  <div>
    <h1># 成员信息</h1>
    <cDivider/>
    <!-- 成员选择器 -->
    <ChooseMember ref="chooseMember" @changemember="change"/>
    <el-button type="primary" @click="submit">查询近期房间/录播</el-button>
    <cDivider/>
    <InfoMember :member-id="memberId"/>
    <cDivider/>
    <el-row :gutter="10">
      <el-col :xs="24" :md="12">
        <RoomCtr ref="RoomCtr" :d-board="false"/>
      </el-col>
      <el-col :xs="24" :md="12">
        <div class="c-layout-p">
        <TableLiveCtr :d-live="false" ref="TableLiveCtr"/>
        </div>
      </el-col>
      <!-- 以后加入: 动态 -->
    </el-row>
  </div>
</template>
<script>
import ChooseMember from "@/components/ChooseMember";
import RoomCtr from "@/components/RoomCtr";
import TableLiveCtr from "@/components/TableLiveCtr";
import InfoMember from "@/components/InfoMember";
import cDivider from "@/components/cDivider";

export default {
  name: "member",
  data() {
    return {
      memberId: 0
    };
  },
  methods: {
    submit() {
      /* 获取近期房间 */
      this.$refs.RoomCtr.getAll({
        lastTime: 0,
        limit: 50,
        memberId: this.memberId
      });
      /* 获取近期录播 */
      this.$refs.TableLiveCtr.getLive({
        lastTime: 0,
        limit: 50,
        memberId: this.memberId,
        groupId: 0
      });
    },
    change() {
      this.memberId = this.$refs.chooseMember.value[2] || 0;
    }
  },
  components: { TableLiveCtr, RoomCtr, ChooseMember, InfoMember, cDivider }
};
</script>