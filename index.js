import Vue from "./vue/vue.js";

new Vue({
  el: "#app",
  data: {
    clickInfo: "点我试试",
    src: "./apple.png",
    text: "我是一段文字",
    html: "<span style='color: red;'>我也是一段文字</span>",
    style: "color: pink;",

    //todo:去支持对象和数组
    obj: {
      name: "kim",
      age: 15
    },
    arr: [0, 1, 2]
  },
  methods: {
    handlerClick(el) {
      console.log(el.target, this)
      this.src = "";
      this.clickInfo = "真牛呀";
      this.html = "<span style='color: red;'>我也被点了</span>";
      this.text = "我被点了";
    }
  }
})