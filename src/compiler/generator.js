import { compileTemplate, } from './template';
import { error, noop, arrayDistinct } from '../util/util';
import processDirectives from '../directives/index';

const globals = ['true', 'false', 'undefined', 'null', 'NaN', 'typeof', 'in'];
const SVG_ELEMENTS = ['svg','animate','circle','clippath','cursor','defs','desc','ellipse','filter','font-face','foreignObject','g','glyph','image','line','marker','mask','missing-glyph','path','pattern','polygon','polyline','rect','switch','symbol','text','textpath','tspan','use','view'];
const specialDirectives = {};// TODO

export default function generate(ast) {
  let { output, dependencies } = generateNode(ast, undefined);
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
  try {
    return new Function('y', code);
  } catch(e) {
    error('Could not create render function');
    return noop;
  }
}

const generateStaticNode = function(nodeOutput, staticNodes) {
  const staticNodesLength = staticNodes.length;
  staticNodes[staticNodesLength] = nodeOutput;
  return `staticNodes[${staticNodesLength}]`;
};

const generateData = function(data) {
  let dataOutput = '{';
  let separator = '';

  // // Events
  // let events = data.events;
  // let eventHandlerSeparator = '';
  // if(events !== undefined) {
  //   dataOutput += "events: {";
  //
  //   for(let eventType in events) {
  //     dataOutput += `${separator}"${eventType}": [`;
  //
  //     let handlers = events[eventType];
  //     for(let i = 0; i < handlers.length; i++) {
  //       dataOutput += eventHandlerSeparator + handlers[i];
  //       eventHandlerSeparator = ", ";
  //     }
  //
  //     separator = ", ";
  //     eventHandlerSeparator = '';
  //     dataOutput += ']';
  //   }
  //
  //   dataOutput += '}';
  //   delete data.events;
  // }
  //
  // // Flags
  // if(data.flags === 0) {
  //   delete data.flags;
  // }

  for(let key in data) {
    dataOutput += `${separator}${key}: ${data[key]}`;
    separator = ', ';
  }

  return dataOutput + '}';
};

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
    nodeOutput = processDirectives(props, nodeOutput, nodeDependencies, node);
  }

  return {
    output: nodeOutput,
    dependencies: nodeDependencies
  };
};
