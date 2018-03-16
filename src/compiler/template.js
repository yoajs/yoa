import { escapeString, error } from '../util/util';

const concatenationSymbol = ' + '

export default function compileTemplate(template) {
  let output = '"';
  let dependencies = [];
  for (let i = 0; i < template.length; i++) {
    const char = template[i];
    const nextChar = template[i+1];

    if(char === '{' && nextChar === '{') {
      i += 2;
      const textTail = template.substr(i);
      const endIndex = textTail.indexOf('}}');
      if(endIndex === -1) {
        // no closed
        if(__ENV__ !== "production") {
          error(("Expected closing delimiter \"}}\" after \"" + textTail + "\""));
        }
        i = template.length;
        output += escapeString(textTail);
      }else {
        i += 2 + endIndex - 1;
        const variableName = textTail.substr(0, endIndex).trim();
        if(variableName.indexOf('(') >= 0) {
          // has expression
          let vars = variableName.split(/[^A-Za-z0-9]/);
          dependencies.push(...vars);
        }else {
          dependencies.push(variableName);
        }
        output += `" + (${variableName}) + "`
      }
    }else {
      output += escapeString(char);
    }
  }

  output += '"';

  return {output, dependencies};
}
