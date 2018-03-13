import {
  createNodeFromVNode,
  appendChild,
  removeChild,
  replaceChild
} from './dom';

// patch type
const PATCH = {
  SKIP: 0,
  APPEND: 1,
  REMOVE: 2,
  REPLACE: 3,
  TEXT: 4,
  CHILDREN: 5
}

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
  if(old.meta !== undefined) {
    // old is VNode
    if(vnode.type !== old.type) {
      // root change
      let newRoot = createNodeFromVNode(vnode);
      replaceChild(old.meta.el, newRoot, vnode, parent);

      this.$el = newRoot;
    }else {
      // diff children
      diff(old, vnode, parent);
    }
  } else if(old instanceof Node) {
    // old is html DOM => first run
    var newNode = hydrate(old, vnode, parent);

    if(newNode !== old) {
      this.$el = vnode.meta.el;
    }
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

    return node;
  }
}

function diff(oldVNode, newVNode, parent) {
  if(oldVNode === null) {
    appendChild(createNodeFromVNode(newVNode), newVNode, parent);

    return PATCH.APPEND;
  } else if(newVNode === null) {
    removeChild(oldVNode.meta.el, parent);
    return PATCH.REMOVE;
  } else if(oldVNode === newVNode) {
    return PATCH.SKIP;
  } else if(oldVNode.type !== newVNode.type) {
    replaceChild(oldVNode.meta.el, createNodeFromVNode(newVNode), newVNode, parent);

    return PATCH.REPLACE;
  } else if(newVNode.type === '#text') {
    let node = oldVNode.meta.el;
    if(oldVNode.type === '#text') {
      if(newVNode.val !== oldVNode.val) {
        node.textContent = newVNode.val;
      }
      return PATCH.TEXT;
    } else {
      replaceChild(node, createNodeFromVNode(newVNode), newVNode, parent);
      return PATCH.REPLACE;
    }
  } else {
    let node = oldVNode.meta.el;

    diffProps(node, oldVNode.props.attrs, newVNode);
    oldVNode.props.attrs = newVNode.props.attrs;

    // Check if innerHTML was changed, don't diff children
    let domProps = newVNode.props.dom;
    if(domProps !== undefined && domProps.innerHTML !== undefined) {
      return PATCH.SKIP;
    }

    // Diff Children
    let newChildrens = newVNode.childrens;
    let oldChildrens = oldVNode.childrens;
    let newLength = newChildrens.length;
    let oldLength = oldChildrens.length;

    if(newLength === 0 && oldLength !== 0) {
      let firstChild = null;

      while((firstChild = node.firstChild) !== null) {
        removeChild(firstChild, node);
      }
      oldVNode.childrens = [];
    } else {
      let maxLength = Math.max(newLength, oldLength);

      for (let i = 0, j = 0; i < maxLength; i++, j++) {
        let oldChild = j < oldLength ? oldChildrens[j] : null;
        let newChild = j < newLength ? newChildrens[i] : null;

        let action = diff(oldChild, newChild, node);

        switch (action) {
          case PATCH.APPEND:
            oldChildrens[oldLength++] = newChild;
            break;
          case PATCH.REMOVE:
            oldChildrens.splice(j--, 1);
            oldLength--;
            break;
          case PATCH.REPLACE:
            oldChildrens[j] = newChildrens[i]
            break;
          case PATCH.TEXT:
            oldChild = newChild.val;
            break;
        }
      }
    }

    return PATCH.CHILDREN;
  }
}

function diffProps(node, nodeProps, vnode) {
  let vnodeProps = vnode.props.attrs;

  for (let vnodePropName in vnodeProps) {
    let vnodePropValue = vnodeProps[vnodePropName];
    let nodePropValue = nodeProps[vnodePropName];

    if(vnodePropValue && (!nodePropValue || vnodePropValue !== nodePropValue)) {
      if(vnodePropName.length === 10 && vnodePropName === "xlink:href") {
        node.setAttributeNS('http://www.w3.org/1999/xlink', "href", vnodePropValue);
      } else {
        node.setAttribute(vnodePropName, vnodePropValue === true ? '' : vnodePropValue);
      }
    }
  }

  for (let nodePropName in nodeProps) {
    var vnodePropValue = vnodeProps[nodePropName];
    if(!vnodePropValue) {
      node.removeAttribute(nodePropName);
    }
  }
}
