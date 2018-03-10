import { defineProperty, warn, noop } from '../util/util';
import { initMixin } from './init';
import compileMixin from '../compiler/compiler';

function Yoa(options) {
  if (__ENV__ !== 'production' && !(this instanceof Yoa)) {
    warn('Yoa is a constructor and should be called with the `new` keyword');
  }

  // Options
  if(options === undefined) {
    options = {};
  }
  this.$options = options;

  defineProperty(this, '$name', options.name, 'root');

  // Render function
  defineProperty(this, "$render", options.render, noop);

  // Hooks
  defineProperty(this, "$hooks", options.hooks, {});

  const data = options.data;
  if(data === undefined) {
    this.$data = {};
  } else if(typeof data === 'function') {
    this.$data = data.call(this);
  } else {
    this.$data = data;
  }
}

Yoa.config = {
  silent: __ENV__ === 'production'
};

initMixin(Yoa);
compileMixin(Yoa);

export default Yoa;
