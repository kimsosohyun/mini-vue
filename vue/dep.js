export default class Dep {
  constructor() {
    this.subs = [];
  }

  addSub() {
    if(window.target) {
      this.subs.push(window.target);
    }
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}