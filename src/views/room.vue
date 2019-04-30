<template>
  <div>
    <h1># 口袋房间</h1>
    <cDivider/>
    <!-- 日期、时间选择器 -->
    <el-form @submit.native.prevent="submit" :style="{display:'inline-block'}" :inline="true">
      截止时间:
      <el-radio v-model="timeChoose" label="0">当前</el-radio>
      <el-radio v-model="timeChoose" label="1">选择时间</el-radio>
      <el-date-picker
        v-model="time"
        type="datetime"
        :disabled="(timeChoose=='0')"
        placeholder="选择日期时间"
      ></el-date-picker>
    </el-form>
    <!-- 成员选择器 -->
    <ChooseMember ref="chooseMember"/>
    <!-- 提交 -->
    <el-button type="primary" @click="submit">提交</el-button>
    <cDivider/>

    <RoomCtr ref="RoomCtr"/>

    <el-alert v-if="GLOBAL.debug" type="success" :closable="false">
      最终提交:
      <br>
      next: {{ time.getTime() }}
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
      timeChoose: "0",
      time: new Date(),
      groupId: 0,
      teamId: 0,
      memberId: 0,
      main: [{}],
      board: [{}]
    };
  },
  methods: {
    submit() {
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
        //如果截止时间是当前，nextTime就设为0
        nextTime: this.timeChoose == 0 ? 0 : this.time.getTime(),
        groupId: this.groupId,
        teamId: this.teamId,
        memberId: this.memberId
      });
    }
  },
  components: { ChooseMember, ChoosePram, RoomCtr, cDivider }
};
</script>