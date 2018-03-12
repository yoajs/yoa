export function y(tag, attrs, meta, childrens) {
  let component = null;
  if(tag === '#text') {
    // Tag => #text
    // Attrs => meta
    // Meta => val
    return createElement('#text', meta, {attrs:{}}, attrs, []);
  }

  return createElement(tag, '', attrs, meta, childrens)
}

const createElement = function(type, val, props, meta, childrens) {
  return {
    type: type,
    val: val,
    props: props,
    childrens: childrens,
    meta: meta || defaultMetadata()
  };
}

const defaultMetadata = function() {
  return {
    shouldRender: false
  }
}
