export function createNodeFromVNode(vnode) {
  var el = null;
  if(vnode.type === '#text') {
    el = document.createTextNode(vnode.val);
  }else {
    el = vnode.meta.isSVG
      ? document.createElementNS("http://www.w3.org/2000/svg", vnode.type)
      : document.createElement(vnode.type);
    if(vnode.childrens.length === 1 && vnode.childrens[0].type === '#text') {
      el.textContent = vnode.childrens[0].val;
      vnode.childrens[0].meta.el = el.firstChild;// set el
    } else {
      for (let i = 0; i < vnode.children.length; i++) {
        var vchild = vnode.children[i];
        appendChild(createNodeFromVNode(vchild), vchild, el);
      }
    }

    vnode.meta.el = el;
    return el;
  }
}

export function appendChild(node, vnode, parent) {
  parent.appendChild(node);
}

export function removeChild(node, parent) {
  parent.removeChild(node);
}

export function replaceChild(oldNode, newNode, vnode, parent) {
  parent.replaceChild(newNode, oldNode);
}
