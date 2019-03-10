/* 成员直播表格 */
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
.c-cwidth {
  max-width: 10rem;
}
</style>
<style>
tr.c-table-live td,
tr.c-table-live td a {
  color: var(--teamcolor);
}
</style>

<template>
  <div class="mdui-table-fluid mdui-shadow-0">
    <div class="c-table">
      <table class="mdui-table mdui-table-hoverable">
        <thead>
          <tr>
            <th>成员</th>
            <th>直播副标题</th>
            <th>类型</th>
            <th>开播时间</th>
            <th>配图</th>
            <th>在线观看</th>
            <th>视频源地址</th>
            <th>弹幕源地址</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in list"
            :key="row.liveId"
            :style="{'--teamcolor': GLOBAL.renderColor(row.memberId)}"
            class="c-table-live"
          >
            <td>{{ GLOBAL.memberId2name(row.memberId) }}</td>
            <td class="c-cwidth">{{ row.subTitle }}</td>
            <td>{{ row.liveType == 1 ? "视频" : "电台" }}</td>
            <td>{{ new Date(row.startTime).Format("yyyy-MM-dd HH:mm:ss") }}</td>
            <td :class="{'c-cwidth': isCol}">
              <img :src="GLOBAL.getPicPath(pic)" v-for="pic in row.picPath.split(',')">
            </td>
            <td :class="{'c-cwidth': isCol}">
              <a :href="GLOBAL.liveUrl + row.liveId" target="_blank">{{GLOBAL.liveUrl + row.liveId}}</a>
            </td>
            <td :class="{'c-cwidth': isCol}">
              <!-- 被更正时，显示被更正的原地址 -->
              <div>
                <el-tooltip v-if="renderStreamPath(row)!=row.streamPath" effect="light">
                  <i class="el-icon-info"/>
                  <span slot="content" style="white-space: normal;">
                    被更正的原地址:
                    <a :href="row.streamPath" target="_blank">{{row.streamPath}}</a>
                  </span>
                </el-tooltip>
                <a :href="renderStreamPath(row)" target="_blank">{{renderStreamPath(row)}}</a>
              </div>
            </td>
            <td :class="{'c-cwidth': isCol}">
              <a :href="GLOBAL.getPicPath(row.lrcPath)" target="_blank">{{GLOBAL.getPicPath(row.lrcPath)}}</a>
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
    renderStreamPath(row) {
      var dateObj = new Date(row.startTime);
      var actualDate = `${dateObj.getFullYear()}${dateObj.getMonth() +
        1}${dateObj.getDate()}`;
      // 修复一直播链接
      // See: https://github.com/xsaiting/pocket48-grab/issues/35
      function isYizhiboHost(host) {
        return host.toLowerCase() === "alcdn.hls.xiaoka.tv";
      }
      var streamPath = row.streamPath.replace(
        /^(http|https):\/\/([^\/]+)\/(\d+)/,
        function(pathPrefix, protocol, host, date) {
          // 不是一直播或者日期正确则直接使用给的链接
          if (!isYizhiboHost(host) || actualDate === date) {
            return pathPrefix;
          }

          return `${protocol}://${host}/${actualDate}`;
        }
      );
      /*       var nodeInner = [
        `<a href="${row.streamPath}" target="_blank">${row.streamPath}</a>`
      ];

      if (streamPath !== row.streamPath) {
        // 需要修正url
        nodeInner.push(
          `<p><a class="link-tip" href="https://github.com/xsaiting/pocket48-grab/issues/35" target="_blank">上方链接有误？请尝试使用下方链接</a></p>`
        );
        nodeInner.push(
          `<a href="${streamPath}" target="_blank">${streamPath}</a>`
        );
      } */
      return streamPath;
    }
  },
  props: {
    list: Array, //列表
    isCol: Boolean //是否收起
  },
  updated() {
    this.GLOBAL.mdui.updateTables();
  }
};
</script>