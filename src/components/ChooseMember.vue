/* 成员选择器 ChooseMember */
<template>
  <el-cascader
    @change="change"
    style="min-width: 15rem;"
    v-model="value"
    placeholder="搜索团/队/姓名/缩写..."
    :options="data"
    filterable
    change-on-select
  ></el-cascader>
</template>
<script>
export default {
  name: "ChooseMember",
  data() {
    return {
      value: []
    };
  },
  methods: {
    change() {
      if (this.value[2]) this.$emit("changemember");
    }
  },
  computed: {
    info() {
      return this.GLOBAL.info;
    },
    data() {
      var info = this.info;
      var data = [{value: 0, label: '全团'}];
      try {
        /* group */
        info.groupInfo.forEach(group => {
          data.push({
            value: group.groupId,
            label: group.groupName,
            children: (function() {
              /* team */
              var teams = [];
              info.teamInfo.forEach(team => {
                if (team.groupId == group.groupId) {
                  teams.push({
                    value: team.teamId,
                    label: team.teamName,
                    children: (function() {
                      /* member */
                      var members = [];
                      info.starInfo.forEach(member => {
                        if (
                          member.teamId == team.teamId &&
                          member.groupId == group.groupId
                        ) {
                          members.push({
                            value: member.userId,
                            label:
                              member.realName +
                              " " + member.abbr
/*                               (function() {
                                var t = member.pinyin.match(/[A-Z]/g);
                                if (t) {
                                  return t.join("").toLowerCase();
                                } else {
                                  return "";
                                }
                              })() */
                          });
                        }
                      });
                      return members;
                    })()
                  });
                }
              });
              return teams;
            })()
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