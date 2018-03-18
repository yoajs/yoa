import { compileTemplateExpression } from '../compiler/template';

let directives = {};

directives['y-if'] = {
  gencode: function(prop, code, astNode) {
    const type = astNode.type;

    let res = compileTemplateExpression(prop.value);
    let output = `((${res.output}) ? ${code} : null)`;
    return {output, dependencies: res.dependencies};
  }
};

export default function processDirectives(props, originOutput, originDependencies, astNode) {
  let output = originOutput;
  for (var directive in directives) {
    let directiveProp = props.find((p) => p.name === directive);
    if(directiveProp) {
      let codeInfo = directives[directive].gencode(directiveProp, output, astNode);
      output = codeInfo.output;
      if(codeInfo.dependencies) {
        originDependencies.push(...codeInfo.dependencies);
      }
    }
  }

  return output || originOutput;
}
