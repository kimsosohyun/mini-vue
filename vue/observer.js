import Dep from "./dep.js";

export default class Observer {
  constructor(data) {
    //data的类型只会为数组或对象
    //data首次传的是 options.data
    //在递归中或set中会传入数组进行响应式绑定

    if (Array.isArray(data)) {
      //todo: 数组的操作

    } else {
      this.walk(data);
    }
  }

  walk(obj) {
    Object.keys(obj).forEach(item => {
      this.defineReactive(obj, item, obj[item]);
    })
  }

  defineReactive(obj, key, value) {
    if(typeof value === "object") {
      //数组也会进入递归绑定响应式
      new Observer(value);
    }

    const dep = new Dep(); //为我这个key值单独创建一个dep，存放依赖
    
    //为对象绑定get后，取值都是从get中取!
    //当你改变this.xxx后，再次去获取xxx，若未重新给get的返回值赋值，你是拿不到你改的那个值的！！
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        //收集依赖
        dep.addSub();
        return value;
      },
      set(newVal) {
        //依赖更新

        if(newVal === value) {
          //若更新的值和现在data上绑定的值相同则不更新
          return;
        }
        value =  newVal; //这一步是为了get的时候能返回正确的value值
      
        if(typeof newVal === "object") {
          //新改变的值为对象或者数组，需要重新绑定响应式
          new Observer(newVal);
        }

        dep.notify();
      }
      
    })

  }
}