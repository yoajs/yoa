import { log, callHook, defineProperty, noop } from '../util/util';

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

    // build

    callHook(this, 'mounted');
  }
}
