import compile from '../compiler/compiler';

export default function initGlobalApi(Yoa) {
  Yoa.compile = function(template) {
    return compile(template);
  }
}
