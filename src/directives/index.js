import { compileTemplateExpression } from '../compiler/template';

let directives = {};

directives['y-if'] = {
  gencode: function(prop, code, astNode, astParentNode) {
    const type = astNode.type;
    let res = compileTemplateExpression(prop.value);
    let output = `((${res.output}) ? ${code} : null)`;
    // TODO: 显示else的信息
    return {output, dependencies: res.dependencies};
  },
  preTransform: function(astNode, astParentNode) {
    const siblings = astParentNode.childrens;
    const nodePos = siblings.indexOf(astNode);
    astNode.if = astNode.attrs['y-if'];
    astNode.else = [];
    for (let i = nodePos + 1; i < siblings.length; i++) {
      const nextNode = siblings[i];
      const nextNodeAttrs = nextNode.attrs;
      if(nextNodeAttrs['y-else-if']) {
        // else if
        nextNode.isProcess = true;
        astNode.else.push({
          exp: nextNodeAttrs['y-else-if'],
          block: nextNode
        });
      } else if(nextNodeAttrs['y-else'] !== undefined) {
        // else
        nextNode.isProcess = true;
        astNode.else.push({
          block: nextNode
        });
      } else {
        break;
      }
    }
  },
};

// directives['y-else'] = directives['y-else-if'] = {
//   preTransform: function(astNode, astParentNode) {
//     if(astNode.isProcess) {
//       // remove
//
//     }
//   }
// }

export function processDirectives(props, originOutput, originDependencies, astNode, astParentNode) {
  let output = originOutput;
  for (var directive in directives) {
    if(astNode.attrs[directive] !== undefined && directives[directive].gencode) {
      let directiveProp = getAndRemoveProps(astNode, directive);
      if(directiveProp) {
        let codeInfo = directives[directive].gencode(directiveProp, output, astNode, astParentNode);
        output = codeInfo.output;
        if(codeInfo.dependencies) {
          originDependencies.push(...codeInfo.dependencies);
        }
      }
    }
  }

  return output || originOutput;
}

export function preTransformDirectives(astNode, astNodeParent) {
  for (var directive in directives) {
    if(astNode.attrs[directive] !== undefined && directives[directive].preTransform) {
      directives[directive].preTransform(astNode, astNodeParent)
    }
  }
}

function getAndRemoveProps(astNode, attr) {
  let props = astNode.props;
  let out = null;
  for (var i = 0; i < props.length; i++) {
    if(props[i] && props[i].name === attr) {
      out = props[i];
      props.splice(i, 1);
      break;
    }
  }

  return out;
}
