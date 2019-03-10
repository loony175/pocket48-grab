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
</style>

<template>
  <div>
    <div class="mdui-table-fluid mdui-shadow-0">
      <table class="mdui-table mdui-table-hoverable">
        <thead>
          <tr>
            <th>公演标题</th>
            <th>副标题</th>
            <th>类型</th>
            <th>开播时间</th>
            <th>配图</th>
            <th>超清源地址</th>
            <th>高清源地址</th>
            <th>流畅源地址</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in list"
            :key="row.liveId"
            :style="{'--teamcolor': GLOBAL.renderColorG(row.groupId)}"
            class="c-table-live"
          >
            <!-- 标题 -->
            <td>{{ row.title }}</td>
            <!-- 副标题 -->
            <td class="c-cwidth">{{ row.subTitle }}</td>
            <!-- 类型 -->
            <td>{{ (row.isReview)?'录播':(row.isOpen?('直播中'):('直播')) }}</td>
            <!-- 时间 -->
            <td>{{ new Date(row.startTime).Format("yyyy-MM-dd HH:mm:ss") }}</td>
            <!-- 配图 -->
            <td :class="{'c-cwidth': isCol}">
              <img :src="GLOBAL.getPicPath(row.picPath)">
            </td>
            <!-- 源地址 -->
            <td :class="{'c-cwidth': isCol}">
              <i v-show="!row.streamPathHd" class="el-icon-loading"></i>
              <a :href="row.streamPathHd" target="_blank">{{row.streamPathHd}}</a>
            </td>
            <td :class="{'c-cwidth': isCol}">
              <i v-show="!row.streamPathLd" class="el-icon-loading"></i>
              <a :href="row.streamPathLd" target="_blank">{{row.streamPathLd}}</a>
            </td>
            <td :class="{'c-cwidth': isCol}">
              <i v-show="!row.streamPath" class="el-icon-loading"></i>
              <a :href="row.streamPath" target="_blank">{{row.streamPath}}</a>
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
    }
  }
};
</script>