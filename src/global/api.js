import compile from '../compiler/compiler';

export default function initGlobalApi(Yoa) {
  Yoa.compile = function(template) {
    return compile(template);
  };

  Yoa.nextTick = function(fn) {
    setTimeout(fn, 0);
  };

  Yoa.version = __VERSION__;
}
