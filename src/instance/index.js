import { defineProperty, warn } from '../util/index';

function Yoa(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Yoa)) {
    warn('Yoa is a constructor and should be called with the `new` keyword');
  }

  // Options
  if(options === undefined) {
    options = {};
  }
  this.$options = options;

  defineProperty(this, '$name', options.name, 'root');

  const data = options.data;
  if(data === undefined) {
    this.$data = {};
  } else if(typeof data === 'function') {
    this.$data = data.call(this);
  } else {
    this.$data = data;
  }
}

export default Yoa;
