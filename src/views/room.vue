<template>
  <div>
    <h1># 口袋房间</h1>
    <cDivider/>
    <!-- 日期、数量选择器 -->
    <ChoosePram ref="choosePram" @submit="submit"/>
    <!-- 成员选择器 -->
    <ChooseMember ref="chooseMember" />
    <!-- 提交 -->
    <el-button type="primary" @click="submit">提交</el-button>
    <cDivider/>

    <RoomCtr ref="RoomCtr" />

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
import cDivider from "@/components/cDivider";
import RoomCtr from "@/components/RoomCtr";
export default {
  name: "room",
  data() {
    return {
      next: '0',
      groupId: 0,
      teamId: 0,
      memberId: 0,
      main: [{}],
      board: [{}]
    };
  },
  methods: {
    submit() {
      this.next = this.$refs.choosePram.next;

      /* 如果选择了member, 则设置groupId=0, teamId=0 */
      if (this.$refs.chooseMember.value[2]) {
        this.groupId = 0;
        this.teamId = 0;
      } else {
        this.groupId = this.$refs.chooseMember.value[0] || 0;
        this.teamId = this.$refs.chooseMember.value[1] || 0;
      }
      this.memberId = this.$refs.chooseMember.value[2] || 0;

      this.$refs.RoomCtr.getAll({
        nextTime: this.next,
        groupId: this.groupId,
        teamId: this.teamId,
        memberId: this.memberId
      });
    }
  },
  components: { ChooseMember, ChoosePram, RoomCtr, cDivider }
};
</script>