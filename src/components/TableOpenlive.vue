/* 公演表格 */
<style scoped>
img {
  max-width: 20px;
  max-height: 20px;
}
table td {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  line-height: 1rem;
  padding-top: 10px;
  padding-bottom: 10px;
}
/* 限制宽度 */
.c-cwidth {
  max-width: 10rem;
}
</style>
<style>
tr.c-table-live td,
tr.c-table-live td a {
  color: var(--teamcolor);
}
div.c-is-col td.c-switch-width {
  max-width: 10rem;
}
</style>

<template>
  <div>
    <div class="mdui-table-fluid mdui-shadow-0" :class="{'c-is-col': isCol}">
      <table class="mdui-table mdui-table-hoverable">
        <thead>
          <tr>
            <th>公演标题</th>
            <th>队伍</th>
            <th>类型</th>
            <th>开播时间</th>
            <th>配图</th>
            <th>在线播放</th>
            <th>高清源地址</th>
            <th>流畅源地址</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in list"
            :key="row.liveId"
            :style="{'--teamcolor': renderColor(row)}"
            class="c-table-live"
          >
            <!-- 标题 -->
            <td>{{ row.title }}</td>
            <!-- 队伍 -->
            <td class="c-switch-width">
              <span v-for="team in row.teamList" :key="team.teamId">{{ team.teamName+' ' }}</span>
            </td>
            <!-- 类型 -->
            <td>公演</td>
            <!-- 时间 -->
            <td>{{ new Date(parseInt(row.stime)).Format("yyyy-MM-dd HH:mm:ss") }}</td>
            <!-- 配图 -->
            <td class="c-switch-width">
              <img v-lazy="GLOBAL.getPicPath(row.coverPath)">
            </td>
            <!-- 在线观看 -->
            <td class="c-switch-width">
              <a :href="GLOBAL.liveUrl + row.liveId" target="_blank">{{GLOBAL.liveUrl + row.liveId}}</a>
            </td>
            <!-- 源地址 -->
            <td class="c-switch-width">
              <span v-if="row.playStreams">
                <i v-show="!row.playStreams.length" class="el-icon-loading"></i>
                <a
                  v-if="row.playStreams.length"
                  :href="row.playStreams[1].streamPath"
                  target="_blank"
                >{{row.playStreams[1].streamPath}}</a>
              </span>
            </td>
            <td class="c-switch-width">
              <span v-if="row.playStreams">
                <i v-show="!row.playStreams.length" class="el-icon-loading"></i>
                <a
                  v-if="row.playStreams.length"
                  :href="row.playStreams[0].streamPath"
                  target="_blank"
                >{{row.playStreams[0].streamPath}}</a>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },

  methods: {
    renderColor(row) {
      if (row.teamList.length > 0) {
        if (row.teamList[0]) {
          if (row.teamList[0].teamColor) {
            return "#" + row.teamList[0].teamColor;
          } else {
            console.log(row.teamList[0]);
          }
        } else {
          console.log(row.teamList);
        }
      } else {
        return "#000";
      }
      return 0;
    }
  },
  props: {
    list: {
      //列表
      type: Array,
      default: []
    },
    isCol: {
      //是否收起
      type: Boolean,
      default: true
    },
    isRecord: {
      type: Boolean,
      default: true
    }
  },
  updated() {}
};
</script>