export default class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    window.target = this;
    this.value = vm[key];
    window.target = undefined;
  }

  update() {
    const newVal = this.vm[this.key],
          oldVal = this.value;

    if(newVal === oldVal) {
      return;
    }
    this.cb.call(this.vm, newVal, oldVal);
  }
}