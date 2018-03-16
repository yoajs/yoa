import { log, callHook, defineProperty, noop, error } from '../util/util';
import { y, patch } from '../vdom/vnode';

export function initMixin(Yoa) {
  Yoa.prototype.init = function() {
    log('Yoa init!');
    callHook(this, 'init');

    const el = this.$options.el;
    if(el !== undefined) {
      this.mount(el);
    }
  }

  Yoa.prototype.mount = function(el) {
    this.$el = typeof el === 'string' ? document.querySelector(el) : el;

    if(__ENV__ !== "production" && this.$el === null) {
      // Element not found
      error("Element " + this.$options.el + " not found");
    }

    defineProperty(this, "$template", this.$options.template, this.$el.outerHTML);

    if(this.$render === noop) {
      this.$render = Yoa.compile(this.$template);
    }

    // first build
    this.build();

    callHook(this, 'mounted');
  }

  Yoa.prototype.build = function() {
    const dom = this.render();

    let old = null;
    if(this.$dom.meta !== undefined) {
      old = this.$dom;
    }else {
      old = this.$el;
      this.$dom = dom;
    }

    patch(old, dom, this.$el.parentNode);
  }

  Yoa.prototype.render = function() {
    return this.$render(y);
  }

  Yoa.prototype.get = function(key) {
    if(__ENV__ !== "production" && !(key in this.$data)) {
      error(`The item "${key}" was not defined but was referenced`);
    }
    return this.$data[key];
  }

  Yoa.prototype.set = function(key, val) {
    this.$data[key] = val;
    this.build();
  }

  Yoa.prototype.registerMethod = function(methods) {
    let data = this.$data;

    for (let methodName in methods) {
      data[methodName] = methods[methodName].bind(this);
    }
  }
}
