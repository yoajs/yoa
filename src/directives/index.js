import { compileTemplateExpression } from '../compiler/template';

let directives = {};

directives['y-if'] = {
  gencode: function(prop, code, astNode, astParentNode) {
    const type = astNode.type;
    const siblings = astParentNode.childrens;

    let res = compileTemplateExpression(prop.value);
    let output = `((${res.output}) ? ${code} : null)`;
    let nextIndex = siblings.indexOf(astNode) + 1;
    if(siblings[nextIndex]) {
      console.log(siblings[nextIndex]);// TODO
    }
    return {output, dependencies: res.dependencies};
  }
};

export default function processDirectives(props, originOutput, originDependencies, astNode, astParentNode) {
  let output = originOutput;
  for (var directive in directives) {
    let directiveProp = getAndRemoveProps(astNode, directive);
    if(directiveProp) {
      let codeInfo = directives[directive].gencode(directiveProp, output, astNode, astParentNode);
      output = codeInfo.output;
      if(codeInfo.dependencies) {
        originDependencies.push(...codeInfo.dependencies);
      }
    }
  }

  return output || originOutput;
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
