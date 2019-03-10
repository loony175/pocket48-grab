/* 房间右墙 Board */
<style>
.c-room-board {
  background-color: rgb(198, 226, 255);
  padding: 0.5rem;
}
</style>
<template>
  <div class="c-layout-80">
    <div class="c-room-board">
      <div class="c-room-cardlayout">
        <CardDia v-for="item in list" :item="item" :key="item.msgidClient+item.msgTime"/>
      </div>
    </div>
  </div>
</template>
<script>
import CardDia from "@/components/CardDia";
export default {
  name: "ConBoard",
  data() {
    return {};
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  components: { CardDia }
};
</script>