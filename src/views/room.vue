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
      timeChoose: {{ timeChoose }}
      <br>
      timestring: {{ timestring }}
      <br>
      limit: {{ limit }}
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
      timestring: 0,
      limit: 50,
      groupId: 0,
      memberId: 0,
      main: [{}],
      board: [{}]
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

      /* 如果没有选择member, 删除team选择 */
      if (
        !this.$refs.chooseMember.value[2] &&
        this.$refs.chooseMember.value[1]
      ) {
        this.$refs.chooseMember.value.pop();
      }

      /* 如果选择了member, 则设置groupId=0 */
      if (this.$refs.chooseMember.value[2]) {
        this.groupId = 0;
      } else {
        this.groupId = this.$refs.chooseMember.value[0] || 0;
      }
      this.memberId = this.$refs.chooseMember.value[2] || 0;

      this.$refs.RoomCtr.getAll({
        lastTime: this.timestring,
        limit: this.limit,
        memberId: this.memberId
      });
    }
  },
  components: { ChooseMember, ChoosePram, RoomCtr, cDivider }
};
</script>