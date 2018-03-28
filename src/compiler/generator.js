import { compileTemplate } from './template';
import { generate as generateCode } from './codegen';
import { error, noop, arrayDistinct } from '../util/util';
import { processDirectives, preTransformDirectives } from '../directives/index';

const globals = ['true', 'false', 'undefined', 'null', 'NaN', 'typeof', 'in'];
const SVG_ELEMENTS = ['svg','animate','circle','clippath','cursor','defs','desc','ellipse','filter','font-face','foreignObject','g','glyph','image','line','marker','mask','missing-glyph','path','pattern','polygon','polyline','rect','switch','symbol','text','textpath','tspan','use','view'];
const specialDirectives = {};// TODO

export default function generate(ast) {
  walkAstTree(ast, null);
  // let { output, dependencies } = generateNode(ast, undefined);
  let { output, dependencies } = generateCode(ast, undefined);

  let dependenciesOutput = '';
  dependencies = arrayDistinct(dependencies);
  for (var i = 0; i < dependencies.length; i++) {
    let name = dependencies[i];
    if(name && globals.indexOf(name) === -1 && isNaN(name[0])) {
      dependenciesOutput += `var ${name} = instance.get("${name}");`;
    }
  }

  // Generate render function
  const code = `var instance = this;${dependenciesOutput}return ${output};`;
  console.log(code);
  try {
    return new Function('y', code);
  } catch(e) {
    error('Could not create render function');
    return noop;
  }
}


const walkAstTree = function(ast) {
  if(ast.type === '#text') {
    return;
  }
  generateAstAttrMap(ast);

  ast.childrens.map((item, index) => {
    walkAstTree(item);
  })
}

const generateNode = function(node, parent) {
  const type = node.type;
  let nodeOutput = '';
  let nodeDependencies = [];

  if (type === '#text') {
    // text node
    const {output, dependencies} = compileTemplate(node.value);
    nodeDependencies.push(...dependencies);
    nodeOutput = `y("#text", null, ${output}, null)`;
  }else {
    // normal node
    preTransformDirectives(node, parent);

    if(node.isProcess) {
      return {
        output: null,
        dependencies: []
      }
    }

    // attrs
    let attrs = [];
    const props = node.props;
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      attrs.push(`"${prop.name}": "${prop.value}"`);
    }

    // childrens
    const childrens = node.childrens.map((item, index) => {
      const {output, dependencies} = generateNode(item, node);
      nodeDependencies.push(...dependencies);
      return output;
    });

    nodeOutput = `y("${type}", {${attrs.join(',')}}, null, [${childrens.join(',')}])`;
    nodeOutput = processDirectives(props, nodeOutput, nodeDependencies, node, parent);
  }

  return {
    output: nodeOutput,
    dependencies: nodeDependencies
  };
};

// generate node.attrs from props
const generateAstAttrMap = function(astNode) {
  let attrMap = {};
  let props = astNode.props;
  for (let i = 0; i < props.length; i++) {
    let prop = props[i];
    attrMap[prop.name] = prop.value;
  }
  astNode.attrs = attrMap;
}
