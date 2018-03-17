// patch type
const PATCH = {
  SKIP: 0,
  APPEND: 1,
  REMOVE: 2,
  REPLACE: 3,
  TEXT: 4,
  CHILDREN: 5
}

export function diff(oldVNode, newVNode, parent) {
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

    diffProps(node, oldVNode.props, newVNode);
    oldVNode.props = newVNode.props;

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

export function diffProps(node, nodeProps, vnode) {
  let vnodeProps = vnode.props;

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
