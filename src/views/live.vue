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
import TableLiveCtr from "@/components/TableLiveCtr";
import cDivider from "@/components/cDivider";
export default {
  name: "live",
  data() {
    return {
      timeChoose: "0",
      timestring: 0,
      limit: 50,
      groupId: 0,
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

      /* 向TableLiveCtr组件提交表单 */
      this.$refs.TableLiveCtr.getLive({
        lastTime: this.timestring,
        limit: this.limit,
        memberId: this.memberId,
        groupId: this.groupId
      });
    }
  },
  components: { ChooseMember, ChoosePram, TableLiveCtr, cDivider }
};
</script>