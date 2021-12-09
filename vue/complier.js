import Watcher from "./watcher.js"

export default class Complier {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;

    this.methods = vm.$methods;
    this.compile(this.el);
  }
  compile(el) {
    //对节点进行解析

    const {
      childNodes
    } = el; //得到子节点

    Array.from(childNodes).forEach(node => {
      //分为元素节点和文本节点
      // console.log(node, node.childNodes.length, node.innerHTML)

      if (node.childNodes.length) {
        this.compile(node);
      }

      if (this.isTextNode(node)) {
        //可能有未被html元素包裹的文本节点需要处理 {{}}
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        this.compileElement(node);
      }
    })
  }

  compileText(node) {
    const {
      textContent
    } = node,
    reg = /\{\{(.+?)\}\}/;

    if (reg.test(textContent)) {
      const key = RegExp.$1.trim();

      node.textContent = textContent.replace(reg, this.vm[key]); //初始化时替换{{}}内的值

      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue;
      })
    }
  }
  compileElement(node) {
    //元素节点 处理v-model v-text v-html v-on:click v-bind:src

    if (!node.childNodes.length) {
      //当有子节点时，子节点的内容也会被父节点的textContent读取出来并去解析，导致子节点全部被清掉
      this.compileText(node);
    }

    const attributes = Array.from(node.attributes);

    attributes.forEach(attr => {
      const attrName = attr.name,
        attrValue = attr.value;

      let fnKey;

      if (this.isDirect(attrName)) {
        //是指令

        if (attrName.includes(":")) {
          fnKey = attrName.slice(attrName.indexOf("-") + 1, attrName.indexOf(":"));
        } else {
          fnKey = attrName.slice(attrName.indexOf("-") + 1);
        }

        const updataFn = this[fnKey + "Updater"];

        updataFn && updataFn.call(this, node, attrName, attrValue);
      }
    })
  }

  onUpdater(node, attrName, attrValue) {
    const pos = attrName.indexOf(":") + 1;

    node.addEventListener(attrName.slice(pos), (el) => {
      this.methods[attrValue].call(this.vm, el)
    }, false);
  }

  textUpdater(node, attrName, attrValue) {
    node.textContent = this.vm.attrValue;

    new Watcher(this.vm, attrValue, (newValue) => {
      node.textContent = newValue;
    })
  }

  htmlUpdater(node, attrName, attrValue) {
    node.innerHTML = this.vm[attrValue];

    new Watcher(this.vm, attrValue, (newValue) => {
      node.innerHTML = newValue;
    })
  }

  bindUpdater(node, attrName, attrValue) {
    const pos = attrName.indexOf(":") + 1;

    node.setAttribute(attrName.slice(pos), this.vm[attrValue]);

    new Watcher(this.vm, attrValue, (newValue) => {
      node.setAttribute(attrName.slice(pos), newValue);
    })

  }

  modelUpdater(node, attrName, attrValue) {

    node.value = this.vm[attrValue];

    node.addEventListener("input", (el) => {
      this.vm[attrValue] = el.target.value;
      //vue绑定的值变了，但是视图并没有更新
      //从这里就可以试出没有watcher，只会在初始化时替换值，必须添加watcher使它变为响应式的
    }, false)

    new Watcher(this.vm, attrValue, (newValue) => {

      node.value = newValue;
    })
  }

  isDirect(attrName) {
    return attrName.startsWith("v-")
  }

  isTextNode(node) {
    return node.nodeType === 3;
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
}