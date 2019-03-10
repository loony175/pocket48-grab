<style scoped>
img {
  max-width: 20px;
  max-height: 20px;
}
.table .link {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
<style>
.table .cell {
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<template>
  <el-table size="small" :data="list" class="table" border="true">
    <!-- 1.成员名 -->
    <el-table-column width="auto" label="成员名">
      <template slot-scope="{ row }">{{ GLOBAL.memberId2name(row.memberId) }}</template>
    </el-table-column>

    <!-- 2.副标题(无需slot-scope) -->
    <el-table-column width="auto" label="副标题" prop="subTitle"></el-table-column>

    <!-- 3.类型 1视频 2电台 -->
    <el-table-column width="auto" label="类型">
      <template slot-scope="{ row }">{{ row.liveType == 1 ? "视频" : "电台" }}</template>
    </el-table-column>

    <!-- 4.开播时间 -->
    <el-table-column width="auto" label="开播时间" min-width="120">
      <template slot-scope="{ row }">{{ new Date(row.startTime).Format("yyyy-MM-dd HH:mm:ss") }}</template>
    </el-table-column>

    <!-- 5.配图 -->
    <el-table-column width="auto" label="配图">
      <template slot-scope="{ row }">
        <img :src="getPicPath(pic)" v-for="pic in row.picPath.split(',')">
      </template>
    </el-table-column>

    <!-- 6.在线观看 -->
    <el-table-column label="官方播放地址">
      <template slot-scope="{ row }">
        <div class="link">
          <a :href="GLOBAL.liveUrl + row.liveId" target="_blank">{{GLOBAL.liveUrl + row.liveId}}</a>
        </div>
      </template>
    </el-table-column>

    <!-- 7.视频源地址 -->
    <el-table-column label="视频源地址">
      <template slot-scope="{ row }">
        <!-- 被更正时，显示被更正的原地址 -->
        <div class="link">
          <el-tooltip v-if="renderStreamPath(row)!=row.streamPath" effect="light">
            <i class="el-icon-info"/>
            <span slot="content" style="white-space: normal;">
              被更正的原地址:
              <a :href="row.streamPath" target="_blank">{{row.streamPath}}</a>
            </span>
          </el-tooltip>
          <a :href="renderStreamPath(row)" target="_blank">{{renderStreamPath(row)}}</a>
        </div>
      </template>
    </el-table-column>

    <!-- 8.弹幕源地址 -->
    <el-table-column label="弹幕源地址">
      <template slot-scope="{ row }">
        <div class="link">
          <a :href="getPicPath(row.lrcPath)" target="_blank">{{getPicPath(row.lrcPath)}}</a>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      search: ""
    };
  },

  methods: {
    getPicPath(picUrl) {
      return (picUrl.slice(0, 4) == "http" ? "" : this.GLOBAL.source) + picUrl;
    },
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
    list: Array //列表
  }
};
</script>