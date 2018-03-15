import { escapeString, error } from '../util/util';

const concatenationSymbol = ' + '

export default function compileTemplate(template) {
  let output = '"';
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
        output += endIndex;
      }else {
        i += 2;
        output += `" + (${textTail.substr(0, endIndex).trim()}) + "`
      }
    }else {
      output += escapeString(char);
    }
  }

  output += '"';

  return output;
}
