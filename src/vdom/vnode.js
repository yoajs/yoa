import {
  createNodeFromVNode,
  appendChild,
  removeChild
} from './dom';

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

export function patch(old, vnode, parent) {
  console.log(old, vnode, parent);
  if(old.meth !== undefined) {
    // old is VNode
    // TODO
  } else if(old instanceof Node) {
    // old is html DOM => first run
    var newNode = hydrate(old, vnode, parent);

    // if(newNode !== old) {
    //   this.$el = vnode.meta.el;
    // }
  }
}

function hydrate(node, vnode, parent) {
  var nodeName = node !== null ? node.nodeName.toLowerCase() : null;

  if(node === null) {
    // no node , create
    let newNode = createNodeFromVNode(vnode);
    appendChild(newNode, vnode, parent);
    return newNode;
  } else if(vnode === null) {
    removeChild(node, parent);
    return null;
  } else if(nodeName !== vnode.type) {
    let newNode = createNodeFromVNode(vnode);
    replaceChild(node, newNode, vnode, parent);
    return newNode;
  } else if(vnode.type === '#text') {
    if(nodeName === '#text') {
      if(node.textContent !== vnode.val) {
        node.textContent = vnode.val;
      }

      vnode.meta.el = node;
    }else {
      replaceChild(node, createNodeFromVNode(vnode), vnode, parent);
    }

    return node;
  } else {
    // update diff data
    vnode.meta.el = node;

    // hydrate children
    const childrens = vnode.childrens;
    const length = childrens.length;
    let i = 0;
    let currentChildNode = node.firstChild;
    let vchild = length !== 0 ? childrens[0] : null;

    while(vchild !== null || currentChildNode !== null) {
      let next = currentChildNode !== null ? currentChildNode.nextSibling : null;
      hydrate(currentChildNode, vchild, node);
      i++;
      vchild = i < length ? childrens[i] : null;
      currentChildNode = next;
    }
  }
}
