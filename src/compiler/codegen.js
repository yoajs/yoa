import { compileTemplate } from './template';

export function generate(astNode) {
  const state = {
    dependencies: []
  };
  const code = astNode ? genElement(astNode, state) : 'y("div")';
  return {
    output: code,
    dependencies: state.dependencies
  }
}

export function genElement(astNode, state) {
  if(astNode.if && !astNode.ifProcessed) {
    return genIf(astNode, state)
  } else {
    const type = astNode.type;
    const props = astNode.props;
    const children = genChildrens(astNode, state);
    let code = `y("${type}", ${
      props ? `{${props.map(p => `"${p.name}":"${p.value}"`)}}` : null
    }, null, ${children || 'null'})`
    return code;
  }
}

function genIf(astNode, state) {
  // TODO
}

function genChildrens(astNode, state) {
  const childrens = astNode.childrens;
  return `[${childrens ? childrens.map(c => genNode(c, state)) : ''}]`
}

function genNode(astNode, state) {
  const type = astNode.type;
  if(type === '#text') {
    return genText(astNode, state);
  }else {
    return genElement(astNode, state);
  }
}

function genText(astNode, state) {
  const {output, dependencies} = compileTemplate(astNode.value);
  state.dependencies.push(...dependencies);
  return `y("#text", null, ${output}, null)`;
}
