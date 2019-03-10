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
      var data = [];
      try {
        /* group */
        info.group.forEach(group => {
          data.push({
            value: group.group_id,
            label: group.group_name,
            children: (function() {
              /* team */
              var teams = [];
              info.team.forEach(team => {
                if (team.group_id == group.group_id) {
                  teams.push({
                    value: team.team_id,
                    label: team.team_name,
                    children: (function() {
                      /* member */
                      var members = [];
                      info.memberInfo.forEach(member => {
                        if (
                          member.team == team.team_id &&
                          member.city == group.group_id
                        ) {
                          members.push({
                            value: member.member_id,
                            label:
                              member.real_name +
                              " " +
                              (function() {
                                var t = member.pinyin.match(/[A-Z]/g);
                                if (t) {
                                  return t.join("").toLowerCase();
                                } else {
                                  return "";
                                }
                              })()
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