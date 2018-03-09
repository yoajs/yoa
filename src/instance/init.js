import { log, callHook } from '../util/util';

export function initMixin(Yoa) {
  Yoa.prototype.init = function() {
    callHook(this, 'init');
  }
}
