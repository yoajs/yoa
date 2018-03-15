import compileTemplate from './template';
import { error, noop } from '../util/util'

const globals = ['true', 'false', 'undefined', 'null', 'NaN', 'typeof', 'in'];
const SVG_ELEMENTS = ["svg","animate","circle","clippath","cursor","defs","desc","ellipse","filter","font-face","foreignObject","g","glyph","image","line","marker","mask","missing-glyph","path","pattern","polygon","polyline","rect","switch","symbol","text","textpath","tspan","use","view"];
const specialDirectives = {};// TODO

export default function generate(ast) {
  console.log('ast', JSON.parse(JSON.stringify(ast)));
  const treeOutput = generateNode(ast, undefined);

  console.log(treeOutput);
  return;

  const dependencies = state.dependencies;
  const props = dependencies.props;
  const methods = dependencies.methods;
  let dependenciesOutput = '';

  let staticNodes = state.staticNodes;
  let staticNodesOutput = '';

  let i = 0;
  let separator = '';

  // Generate data prop dependencies
  for(; i < props.length; i++) {
    const propName = props[i];
    dependenciesOutput += `var ${propName} = instance.get("${propName}");`;
  }

  // Generate method dependencies
  for(i = 0; i < methods.length; i++) {
    const methodName = methods[i];
    dependenciesOutput += `var ${methodName} = instance.methods["${methodName}"];`;
  }

  // Generate static nodes
  for(i = 0; i < staticNodes.length; i++) {
    staticNodesOutput += separator + staticNodes[i];
    separator = ", ";
  }

  // Generate render function
  const code = `var instance = this;${dependenciesOutput}return ${treeOutput};`;
  try {
    return new Function('m', code);
  } catch(e) {
    error("Could not create render function");
    return noop;
  }
}

const generateStaticNode = function(nodeOutput, staticNodes) {
  const staticNodesLength = staticNodes.length;
  staticNodes[staticNodesLength] = nodeOutput;
  return `staticNodes[${staticNodesLength}]`;
}

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
    separator = ", ";
  }

  return dataOutput + '}';
}

const generateProps = function(type, props) {
  let propOutput = type + ": {";
  let separator = '';

  for(let i = 0; i < props.length; i++) {
    const prop = props[i];
    let propValue = prop.value;

    if(propValue.length === 0) {
      propValue = "\"\"";
    }

    propOutput += `${separator}"${prop.name}": ${propValue}`;
    separator = ", ";
  }

  return propOutput + '}';
}

const generateNodeState = function(node, parentNode, state) {
  const type = node.type;
  if(type === "#text") {
    // Text
    const compiledText = compileTemplate(node.value, state.dependencies, true);
    node.value = compiledText.output;
    return compiledText.dynamic;
  } else {
    const locals = state.locals;
    let dynamic = false;
    let data = node.data;

    // SVG flag
    if(SVG_ELEMENTS.indexOf(type) !== -1) {
      data.flags = data.flags | FLAG_SVG;
    }

    // Props
    const props = node.props;
    const propsLength = props.length;
    let propStateAttrs = [];
    let propStateDirectives = [];
    let propStateSpecialDirectivesAfter = [];
    node.props = {
      attrs: propStateAttrs,
      directives: propStateDirectives
    };

    // Attributes
    for(let i = 0; i < propsLength; i++) {
      const prop = props[i];
      const propName = prop.name;
      const specialDirective = specialDirectives[propName];

      if(specialDirective !== undefined) {
        // During special directive
        const specialDirectiveDuring = specialDirective.during;
        if(specialDirectiveDuring !== undefined) {
          if(specialDirectiveDuring(prop, node, parentNode, state) === true) {
            dynamic = true;
          }

          propStateAttrs.push(prop);
        }
      } else if(propName[0] === 'm' && propName[1] === '-') {
        // Directive
        if(compileTemplateExpression(prop.value, state) === true) {
          dynamic = true;
        }

        propStateDirectives.push(prop);
      } else {
        // Attribute
        const compiledProp = compileTemplate(prop.value, state.dependencies, true);

        if(compiledProp.dynamic === true) {
          dynamic = true;
        }

        prop.value = compiledProp.output;
        propStateAttrs.push(prop);
      }
    }

    // Children
    const childrens = node.childrens;
    let childStates = [];

    for(let i = 0; i < childrens.length; i++) {
      const childState = generateNodeState(childrens[i], node, state);

      if(childState === true) {
        dynamic = true;
      }

      childStates.push(childState);
    }

    for(let i = 0; i < childrens.length; i++) {
      if(dynamic === true && childStates[i] === false) {
        const childData = childrens[i].data;
      }
    }

    return dynamic;
  }
}

const generateNode = function(node, parent) {
  const type = node.type;
  let output = '';

  if (type === '#text') {
    // text node
    let compiledText = compileTemplate(node.value);
    output = `y("#text", null, null, ${compiledText})`;
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
      return generateNode(item, node);
    });

    output = `y("${type}", {${attrs.join(',')}}, null, [${childrens.join(',')}])`;
  }

  return output;
}
