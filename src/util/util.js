export function defineProperty(obj, prop, value, def) {
  if(value === undefined) {
    obj[prop] = def;
  } else {
    obj[prop] = value;
  }
}

export function log(...args) {
  if(Yoa.config.silent === false) {
    console.log(...args);
  }
}
export function warn(...args) {
  if(Yoa.config.silent === false) {
    console.warn(...args);
  }
}
export function error(...args) {
  if(Yoa.config.silent === false) {
    console.error(...args);
  }
}

export function callHook(instance, name) {
  const hook = instance.$hooks[name];
  if(hook !== undefined) {
    hook.call(instance);
  }
}
