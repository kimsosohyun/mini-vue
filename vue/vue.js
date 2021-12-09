import Observer from "./observer.js";
import Complier from "./complier.js";

export default class Vue {
  constructor(options = {}) {
    console.log(this)
    this.$options = options;
    this.$data = options.data;
    this.$methods = options.methods;

    this.initRootElement(options.el);

    //将data挂载到this上
    this._proxyData(this.$data);

    new Observer(this.$data) //将$data变为响应式，而不是this.xxx变为响应式
    new Complier(this);
  }
  initRootElement(el) {
    if (typeof el === "string") {

      //传的是字符串
      const queryElement = document.querySelector(el);

      if (queryElement) {
        this.$el = document.querySelector(el);
      } else {
        console.error("传入el不符合要求");
      }

    } else if (el instanceof HTMLElement) {

      //传的是html元素
      this.$el = el;
    } else {
      console.error("传入el不符合要求");
    }
  }
  _proxyData(data) {
    const keys = Object.keys(data);

    keys.forEach(key => {
      //这种方式不可取的原因：我们改的是this.xxx，触发不了$data的set
      // if (this[key] !== data[key]) {
      //   this[key] = data[key]; 
      // }
      Object.defineProperty(this, key, {
        enumerable:true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newVal) {
         
          if(newVal === data[key]) {
            return;
          }
          data[key] = newVal; //去触发$data的set
        }
      })
    })
  }
}