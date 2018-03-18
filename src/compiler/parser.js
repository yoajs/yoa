import {
  error
} from '../util/util';

export default function parse(tokens) {
  let root = {
    type: 'ROOT',
    props: {},
    childrens: [],
  };
  let elements = [root];
  let lastIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if(token.type === 'text') {
      // text
      elements[lastIndex].childrens.push({
        type: '#text',
        value: token.value
      });
    } else if(token.type === 'tag') {
      // tag
      if(token.closeStart === true) {
        if(__ENV__ !== 'production' && token.value !== elements[lastIndex].type) {
          error(`The element "${elements[lastIndex].type}" was left unclosed`);
        }
        // close tag, close current element
        elements.pop();// delete last element
        lastIndex--;
      } else {
        // open tag
        const type = token.value;
        const lastChildren = elements[lastIndex].childrens;
        const index = lastChildren.length;

        let node = {
          type: type,
          index: index,
          props: token.attributes,
          childrens: []
        };

        lastChildren[index] = node;

        if(token.closeEnd === false && VOID_ELEMENTS.indexOf(type) === -1) {
          elements.push(node);
          lastIndex++;
        }
      }
    }
  }

  if(__ENV__ !== 'production' && root.childrens[0].type === '#text') {
    error('The root element cannot be text');
  }
  return root.childrens[0];
}

const VOID_ELEMENTS = ['area','base','br','command','embed','hr','img','input','keygen','link','meta','param','source','track','wbr'];
const SVG_ELEMENTS = ['svg','animate','circle','clippath','cursor','defs','desc','ellipse','filter','font-face','foreignObject','g','glyph','image','line','marker','mask','missing-glyph','path','pattern','polygon','polyline','rect','switch','symbol','text','textpath','tspan','use','view'];
